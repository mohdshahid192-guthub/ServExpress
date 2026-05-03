import mongoose, {Schema} from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const userSchema = new Schema({
    username:{
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true, 
      unique: true
    },
    email:{
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true, 
      unique: true
    },
    fullName:{
      type: String,
      trim: true,
      capitalized: true
    },
    location:{
      type: String,
      trim: true,
      capitalized: true
    },
    password:{
      type: String,
      required: [true, "Password is required"]
    },
    
    phone: {
      type: Number,
      pattern: "^[0-9]{10}$"
    },
    avatar:{
      type: String
    },

    refreshToken:{
      type: String
    },

   accountType: {
    type: String,
    required: true,
    enum: ["customer", "professional"]
   },

   serviceCharge: {
    type: Number
   },
   category: {
    type: String
   }
}, 
  
  {timestamps: true})

  userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return 

    else{
     this.password = await bcrypt.hash(this.password, 10)
     
    }
  })

  userSchema.methods.isPasswordCorrect = async function (password){
   return await bcrypt.compare(password, this.password)
  }

  userSchema.methods.generateAccessToken = function () {
   return jwt.sign({
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  
  )

  }

    userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  
  )

  }

  


  export const User = mongoose.model("User", userSchema)