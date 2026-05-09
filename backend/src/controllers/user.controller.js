import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../../../backend/src/utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {v2 as cloudinary} from "cloudinary"

const generateAccessTokenAndRefreshTOken = async (userId) => {
  try {
    const user = await User.findById(userId)
   
    
    const refreshToken =  user.generateRefreshToken()
    const accessToken =  user.generateAccessToken()
   
    
     user.refreshToken = await refreshToken
    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
  } catch (error) {
    throw new ApiError(500, "something went wrong while generating token")
  }
}

const registerUser = asyncHandler(async (req, res) => {
  //user details from frontend
  //validation
  //check if username already exist 
  //create user object - create entry in db
  //remove password and refresh token field from response
  //check for user creation
  //res return
   
   
  const {username, email, password, accountType, phone} = req.body
  
  if ([username, email, password, accountType].some((field) => field?.trim() === "" )) {
    throw new ApiError(400, "Please enter the required fields")
  }
if (accountType === "professional") {
  if (!phone) {
    throw new ApiError(404, "phone number is required")
  }
}
 const existedUser = await User.findOne({$or: [{email}, {username}]})

 if (existedUser) {
  throw new ApiError(409, "User already exist")
 }

 const user = await User.create({
  username: username.toLowerCase(),
  email,
  password,
  accountType,
  phone: parseInt(phone)
 })


const createdUser = await User.findById(user._id).select("-password -refreshToken")
if (!createdUser) {
  throw new ApiError(500,"something went wrong while registration user");
  
}


return res.status(201).json(
new  ApiResponse(200, createdUser, "User registered succesfully"), {success: true}
)



});


const userLogin = asyncHandler(async (req, res) => {
  
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "Please enter the fields");
  }

  const existingUser = await User.findOne({ username });
  if (!existingUser) {
    throw new ApiError(401, "User not found");
  }

  const validUser = await existingUser.isPasswordCorrect(password);
  if (!validUser) {
    throw new ApiError(400, "Password is incorrect");
  }


 const {  refreshToken ,accessToken } = await generateAccessTokenAndRefreshTOken(existingUser._id)

  const loggedInUser = await User.findById(existingUser._id)
    .select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true
  };


  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user: { loggedInUser, refreshToken, accessToken } },
        "User logged in successfully"
      ),
      {success: true}
    );
});

const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: {
        refreshToken: null
       }
       
  },
  {
        returnDocument: "after"
       })

 const options = {
  httpOnly: true,
  secure: true
 }


        return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200,{}, "User Logged Out"))
  
});

const refreshAccessToken = asyncHandler(async (req, res) => {
const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken

if (!incomingRefreshToken) {
  throw new ApiError(401, "Unauthorized request")
}

try {
  const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
  
  if (!decodedToken) {
    throw new ApiError(401,"Unauthorized user");
    
  }
  
  const user = await User.findById(decodedToken?._id)
  
  if (!user) {
    throw new ApiError(401, "invalid refresh token")
  }
  
  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Refresh Token is expired or used");
    
  }
  
  const {accessToken, newRefreshToken} = await generateAccessTokenAndRefreshTOken(user._id)
  
  const options= {
  httpOnly: true,
  secure: true
  }
  
  return res.status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", newRefreshToken, options)
  .json(
    new ApiResponse(200, {
      user , newRefreshToken, accessToken
    }, "access token refreshed")
  )
} catch (error) {
  throw new ApiError(401, error?.message || "Invalid Refresh Token")
}
})

const userLoginCheck = asyncHandler( async (req, res) => {
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
if (!token) {
      return res.status(200).json({success: false})
    }

   const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET )
   
   const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

    return res.status(200).json(new ApiResponse(200, user, "User is Logged in"), {success: true})

});


const professionalCardShowDown = asyncHandler(async (req, res, next) => {
  const location = req.body.city

 
  
  
  const professional = await User.aggregate([
  {
    $match: {
      accountType: "professional",
      ...(location !== "select" ? { location } : {}) // only filter if not "select"
    }
  },
  {
    $project: {
      _id: 1,
      fullName: 1,
      serviceCharge: 1,
      avatar: 1,
      category: 1,
      location: 1
    }
  }
]);

  
  

  return res
    .status(200)
    .json(new ApiResponse(200, professional, "Professional data fetched successfully"));
});

const professionalForBooking = asyncHandler(async (req, res) => {
  
  
 
  const professional = await User.findById(req.body).select("-email -password -username -refreshToken")
  
  
  return res.status(200).json(new ApiResponse(200, professional, "booking details fetched successfully"), {success: true})

})

const professionalWithCategory = asyncHandler(async (req, res) => {

  const {category} = req.body

const normalizedCategory = category.toLowerCase().replace(/s$/, "");
 
 const professional = await User.aggregate([
  
  {$match: {accountType: "professional",
    category: normalizedCategory
  } },
  {$project: {
    _id: 1, 
    fullName: 1, 
    serviceCharge: 1,
    avatar: 1,
    category: 1

  }}
 ])

return res.status(200).json(new ApiResponse(200, professional, "successfully fetched list"))
})

const getProfileDetails = asyncHandler(async (req, res) => {
  const user = req.user

  if (!user) {
    throw new ApiError(400, "Unauthorized user")
  }
  
  const userDetails = await User.aggregate([
    {$match: {_id: user._id}},
    {$project: {
      _id: 1,
      email: 1,
      username: 1,
      fullName: 1,
      phone: 1,
      serviceCharge: 1,
      location: 1,
      experience: 1,
      category: 1,
      avatar: 1
    }}
  ]);


  if (!userDetails) {
    throw new ApiError(400, "User not found");
    
  }

  return res.status(200).json(new ApiResponse(200, userDetails, "User profile fetched successfully"))

})

const uploadAvatar = asyncHandler(async (req, res) => {
  const user = req.user
if (!user) {
  throw new ApiError(400, "Unauthorized User")
}
const avatarFilePath = req.files?.avatar[0]?.path


if (!avatarFilePath) {
  throw new ApiError(400, "Avatar file is required")
}
if (user.avatar?.public_id) {
   await cloudinary.uploader.destroy(user.avatar?.public_id)
}

const avatar = await uploadOnCloudinary(avatarFilePath)

if (!avatar) {
  throw new ApiError(500, "There is some error uploading file to cloudinary");

  
}

const updateUser = await User.findByIdAndUpdate(user._id, {avatar: {url: avatar.secure_url, public_id: avatar.public_id}}, {returnDocument: "after"}).select("-password -refreshToken")

if(!updateUser){
  throw new ApiError(500, "Error occured during saving avatar")
}

return res.status(200).json(new ApiResponse(200, updateUser, "Avatar Uploaded Successfully"))

})

const updateUserProfile = asyncHandler(async (req, res) => {
  const { fullName, experience, phone, serviceCharge, cityValue } = req.body;

  
  const updateData = {};

  if (fullName && fullName.trim() !== "") {
    updateData.fullName = fullName.trim();
  }
  if (experience && experience.trim() !== "") {
    updateData.experience = experience.trim();
  }
  if (phone && phone.trim() !== "") {
    const phoneNo = parseInt(phone, 10);
    if (!isNaN(phoneNo)) updateData.phone = phoneNo;
  }
  if (serviceCharge && serviceCharge.trim() !== "") {
    const serviceChargeValue = parseInt(serviceCharge, 10);
    if (!isNaN(serviceChargeValue)) updateData.serviceCharge = serviceChargeValue;
  }
  if (cityValue && cityValue.trim() !== "") {
    updateData.location = cityValue.trim();
  }

  // If nothing to update
  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "No valid fields provided for update");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: updateData },
    { returnDocument: "after" }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found or Unauthorized user");
  }

  return res.status(200).json(new ApiResponse(200, user, "Profile updated successfully"));
});



export {
  registerUser,
userLogin,
logOutUser,
refreshAccessToken,
userLoginCheck,
professionalCardShowDown,
professionalForBooking,
professionalWithCategory,
getProfileDetails,
uploadAvatar,
updateUserProfile
}
