import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"
import fs from "fs/promises";
import io from "../server.js"
import Post from "../models/post.model.js"

const generateAccessTokenAndgenerateRefreshToken=async(userId)=>{
                 const user=await User.findById(userId)
                const accessToken= await user.generateAccessToken();
                const refreshToken=await user.generateRefreshToken();
                user.refreshToken=refreshToken;
                user.save({validateBeforeSave:false});
                return {refreshToken,accessToken}
}

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password, gender } = req.body;

    // Validate input fields
    if ([fullName, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are mandatory to be filled");
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Please enter a valid email address");
    }
    if (password.length < 8) {
        throw new ApiError(400, "Password must be at least 8 characters long");
    }

    // Check if user already exists
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
        throw new ApiError(409, "User with email already exists");
    }

    // Handle profile picture upload
    let profilePicLocalPath;
    if (req.files && req.files.profilePic?.length > 0) {
        profilePicLocalPath = req.files.profilePic[0].path;
    } else {
        throw new ApiError(400, "Profile picture is required");
    }

    let profilePic;
    try {
        profilePic = await uploadOnCloudinary(profilePicLocalPath);
        if (!profilePic) {
            throw new Error("Failed to upload profile picture");
        }
    } catch (error) {
        // Clean up local file if upload fails
        await fs.unlink(profilePicLocalPath).catch((err) =>
            console.error("Failed to delete local file:", err)
        );
        throw new ApiError(500, "Failed to upload profile picture to Cloudinary");
    }

    // Clean up local file after successful upload
    await fs.unlink(profilePicLocalPath).catch((err) =>
        console.error("Failed to delete local file:", err)
    );
    // Create user
    const user = await User.create({
        fullName,
        email,
        password,
        gender,
        profilePic: profilePic.url || "",
    });

    // Fetch created user (excluding sensitive fields)
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError(500, "Internal server error");
    }

    // Send response
    res.status(201).json(
        new ApiResponse(201, createdUser, "User is registered successfully")
    );
});

export default registerUser;

const loginUser=asyncHandler(async(req,res)=>{
           // get user email and password
           // check whether the user exists in db or not with the help of - email
           //if yes then confirm the password by matching user given password and password of db 
           // if matches then generate a refresh token and allow user to enter the website
           // send cookie

           const {email,password}=req.body
           if(!email)
            {
                throw new ApiError(400,"username or email is required")
            }
           const user=await User.findOne({email:email})
            if(!user)
                {
                    throw new ApiError(404,"User doesn't exist")
                }
            const isPasswordMatch= await user.isPasswordCorrect(password)
            if(!isPasswordMatch)
                {
                    throw new ApiError(400,"password is incorrect");
                }
           const {refreshToken,accessToken}=await generateAccessTokenAndgenerateRefreshToken(user._id)
           const loggedInUser=await User.findById(user._id).select("-password -refreshToken")
           const options={
            httpOnly:true,
            secure:true
           }
           return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(
            new ApiResponse(200,{user:loggedInUser},"User Successfully loggedIn")
           )

})

const logoutUser=asyncHandler(async(req,res)=>{
             await User.findByIdAndUpdate(req.user._id,{
                $set:{refreshToken:null},
               
             }, {
                new:true
            })
            const options={
                httpOnly:true,
                secure:true
               }
               res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,{},"user logged out successfully"))
            
})

const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken||req.body.refreshToken
    if(!incomingRefreshToken)
        throw new ApiError(401,"unauthorized request")
    const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    const user=await User.findById(decodedToken?._id)
    if(!user)
        throw new ApiError(401,"Invalid refresh token")
    if(incomingRefreshToken!==user.refreshToken)
        throw new ApiError(401,"refresh token is expired or used")
    const {newRefreshToken,accessToken}=await generateAccessTokenAndgenerateRefreshToken(user._id)
    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(200).cookie('accessToken',accessToken,options).cookie('refreshToken',newRefreshToken,options).json(new ApiResponse(200,{accessToken,refreshToken:newRefreshToken},"new access token is generated successfully"))
})

const changeCurrentPassword=asyncHandler(async(req,res)=>{
    try{
           const {oldPassword,newPassword}=req.body;
           const user=await User.findById(req.user?._id)
           if(!user)
            throw new ApiError(400,"unauthorized User")
         const isPasswordCorrect=  await user.isPasswordCorrect(oldPassword)
           if(!isPasswordCorrect)
            throw new ApiError(401,"Invalid User")
            user.password=newPassword
            await user.save({validateBeforeSave:false})
            return res.status(200).json(new ApiResponse(200,{},"Password changed successfully"));

    }catch(err){
               throw new ApiError(500,"Internal Server error")
    }
})
const loggedInUser=asyncHandler(async(req,res)=>{
    try {
        const { id } = req.params; // Get the userId from URL params
    
        // Find the user by ID
        const user = await User.findById(id)
          .select('-password') // Don't include password field in response
          .populate('followers', 'fullName profilePic') // Populate followers info
          .populate('following', 'fullName profilePic'); // Populate following info
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Return user data
        res.status(200).json({
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          profilePic: user.profilePic,
          followers: user.followers,
          following: user.following,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
});

const getCurrentUser=asyncHandler(async(req,res)=>{
    return res.status(200).json(new ApiResponse(200,req.user,"current user fetched"))
})
const savePost=asyncHandler(async (req,res)=>{
  const { id: postId } = req.params;  // Post ID from URL
  const { userId } = req.body; // User ID from request body

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if the post exists
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Toggle save: If the post is already saved, remove it; otherwise, add it
  const index = user.savedPosts.indexOf(postId);
  if (index === -1) {
    user.savedPosts.push(postId);
  } else {
    user.savedPosts.splice(index, 1);
  }

  await user.save();

  // Populate saved post details for the response
  const updatedUser = await User.findById(userId).populate({
    path: "savedPosts",
    populate: { path: "userId", select: "fullName email profilePic" },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser.savedPosts, "Post saved status updated successfully"));
})
const updateAccountDetails=asyncHandler(async(req,res)=>{
    try{
             const {fullName,email}=req.body;
            const user= await User.findByIdAndUpdate(req.user?._id,{
                $set:{
                    fullName:fullName,
                    email:email
                }
             },{new:true}).select('-password -refreshToken')
             return res.status(200).json(new ApiResponse(200,user,"account details updated successfully"))
    }catch(err){
throw new ApiError(500,"Internal Server Error")
    }
});

const isFolllowed=asyncHandler(async(req,res)=>{
    const { userId } = req.params; // User being checked (props.post.userId._id)
    const { userId: currentUserId } = req.query; // Current user ID (from params)
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if currentUserId exists in the followers array of user
      const isFollowed = user.followers.includes(currentUserId);
      res.status(200).json({ isFollowed });
    } catch (error) {
      console.error("Error checking follow status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
})
const follow=asyncHandler(async(req,res)=>{
    const { id } = req.params; // ID of the user to follow
    const { userId } = req.body; // ID of the current user
  
    if (id === userId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }
  
    try {
      const userToFollow = await User.findById(id);
      const currentUser = await User.findById(userId);
  
      if (!userToFollow.followers.includes(userId)) {
        // Add userId to the followers of userToFollow
        userToFollow.followers.push(userId);
  
        // Add id to the following of currentUser
        currentUser.following.push(id);
  
        await userToFollow.save();
        await currentUser.save();
        io.emit("followed", { followerId: userId, followedId:id });
  
        res.status(200).json({ message: "Followed successfully" });
      } else {
        res.status(400).json({ message: "You are already following this user" });
      }
    } catch (error) {
      res.status(500).json({ message: "Something went wrong", error });
    }
}
);
const unFollow=asyncHandler(async(req,res)=>{
    const { id } = req.params; // ID of the user to unfollow
  const { userId } = req.body; // ID of the current user

  if (id === userId) {
    return res.status(400).json({ message: "You cannot unfollow yourself" });
  }

  try {
    const userToUnfollow = await User.findById(id);
    const currentUser = await User.findById(userId);

    if (userToUnfollow.followers.includes(userId)) {
      // Remove userId from the followers of userToUnfollow
      userToUnfollow.followers = userToUnfollow.followers.filter(
        (follower) => follower.toString() !== userId
      );

      // Remove id from the following of currentUser
      currentUser.following = currentUser.following.filter(
        (following) => following.toString() !== id
      );

      await userToUnfollow.save();
      await currentUser.save();
      // Emit unfollow event
      io.emit("unfollowed", { followerId: userId, followedId:id });
      res.status(200).json({ message: "Unfollowed successfully" });
    } else {
      res.status(400).json({ message: "You are not following this user" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
}
)

 export {registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateAccountDetails,savePost,follow,unFollow,isFolllowed,loggedInUser}