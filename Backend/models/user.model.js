import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema=new mongoose.Schema(
    {
           fullName:{
            type:String,
            required:true,
            trim:true
           },
           email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'], 
           },
           password:{
            type:String,
            required:[true,"Password is mandotry"],
            trim:true
           },
           profilePic:{
            type:String //cloudinary url
           },
            gender:{
            type:String,
            },
            followers:[{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            }],
            following:[{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            }],
           refreshToken:{
            type:String
           },
           
           savedPosts:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Post'
            }
        ]
    }
,{timestamps:true}
)
userSchema.pre("save",async function(next){
          const user=this;
           if(!user.isModified('password'))
           {
            return next();
           }
           const salt=await bcrypt.genSalt(10);
           const hashedPassword=await bcrypt.hash(user.password,salt)
           user.password=hashedPassword
           next();

})
userSchema.methods.isPasswordCorrect = async function (Userpassword) {
    return await bcrypt.compare(Userpassword, this.password);
  }
  
userSchema.methods.generateAccessToken=function(){
      return jwt.sign(
        {
            _id:this._id,
            email:this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXP
        }
       
       )
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXP
        }
       
       )
}
export const User=mongoose.model("User",userSchema)