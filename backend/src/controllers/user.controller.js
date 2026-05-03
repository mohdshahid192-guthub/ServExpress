import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../../../backend/src/utils/ApiResponse.js";
import jwt from "jsonwebtoken"

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
   
   
  const {username, email, password, accountType} = req.body

  if ([username, email, password, accountType].some((field) => field?.trim() === "" )) {
    throw new ApiError(400, "Please enter the required fields")
  }

 const existedUser = await User.findOne({$or: [{email}, {username}]})

 if (existedUser) {
  throw new ApiError(409, "User already exist")
 }

 const user = await User.create({
  username: username.toLowerCase(),
  email,
  password,
  accountType

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
  const professional = await User.aggregate([
      {
        $match: {accountType: "professional"}
      },
      {
        $project: {
          _id: 1,
          fullName: 1,
          serviceCharge: 1,
          avatar: 1,
          category: 1
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


export {
  registerUser,
userLogin,
logOutUser,
refreshAccessToken,
userLoginCheck,
professionalCardShowDown,
professionalForBooking,
professionalWithCategory
}
