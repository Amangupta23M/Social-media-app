import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Post from "../models/post.model.js";
import io from "../server.js"

const createPost = asyncHandler(async (req, res) => {
  const { userId, desc } = req.body;
  if ([userId, desc].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are mandatory to be filled");
  }
  let imgPath;
  imgPath = req.file.path;
  const Img = await uploadOnCloudinary(imgPath);
  const newPost = new Post({
    userId,
    desc,
    img: Img?.url || "",
  });
  const savedPost = await newPost.save();
  return res
    .status(201)
    .json(new ApiResponse(201, savedPost, "post is uploaded successfully"));
});




const fetchPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate({
    path: "userId",
    select: "fullName email profilePic"
  });
  return res
    .status(200)
    .json(new ApiResponse(200, posts, "All posts are fetched successfully"));
});


const fetchSinglePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById(postId)
    .populate({
      path: "userId", // Populating the user field in the post
      select: "fullName email profilePic"
    }) .populate({
      path: "comments", // Populating the comments field
      populate: {
        path: "postedBy", // Populating the user of each comment
        select: "fullName profilePic"
      }
    });

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post is fetched successfully"));
});








const savePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  post.isSaved = !post.isSaved;
  await post.save();

  // Populate fields after saving the post
  const populatedPost = await Post.findById(postId)
    .populate({
      path: "userId",
      select: "fullName email profilePic"
    });

  return res
    .status(200)
    .json(new ApiResponse(200, populatedPost, "Post is saved successfully"));
});



const addlikePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const updatedPost=await Post.findByIdAndUpdate(postId, {
    $addToSet: { likes: req.body.userId }},{new:true})
    const posts=await Post.find().populate(
      {
      path: "userId",
      select: "fullName email profilePic"
      }
    )
    io.emit("add-like",posts)
    console.log(updatedPost)
  return res
    .status(200)
    .json(new ApiResponse(200,posts, "Post is liked successfully"));
});

const removelikePost = asyncHandler(async (req, res) => {
    const postId = req.params.id;
  const updatedPost=await Post.findByIdAndUpdate(postId, {
    $pull: { likes: req.body.userId }},{new:true})
    const posts=await Post.find()
    .populate({
      path: "userId",
      select: "fullName email profilePic"
      })
    io.emit("remove-like",posts)
   console.log(updatedPost)
  return res
    .status(200)
    .json(new ApiResponse(200,posts, "Post is liked successfully"));
});




const addComment = asyncHandler(async (req, res) => {
  const postComment = await Post.findByIdAndUpdate(req.params.id, {
    $push: { comments: { text: req.body.comment, postedBy: req.body.userId } }
},
    { new: true }
);
const post = await Post.findById(postComment._id).populate({
  path: "comments", // Populating the comments field
  populate: {
    path: "postedBy", // Populating the user of each comment
    select: "fullName profilePic"
  }
});
io.emit("new-comment",post.comments)
  return res
    .status(200)
    .json(new ApiResponse(200, post, "Comment is added successfully"));
})




export { createPost, fetchPosts, savePost, addlikePost,removelikePost,fetchSinglePost,addComment };
