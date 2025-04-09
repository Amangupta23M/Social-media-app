import express from 'express';
import { upload } from "../middlewares/multer.middleware.js";
import { createPost,fetchPosts,savePost,addlikePost,removelikePost,fetchSinglePost,addComment } from "../controllers/post.controller.js";


const router=express.Router()


router.route("/upload").post(upload.single("file"),createPost);
router.route("/post").get(fetchPosts)
router.route("/post/:id").get(fetchSinglePost)
router.route("/post/:id/save").put(savePost)
router.route("/post/:id/addlike").put(addlikePost)
router.route("/post/:id/removelike").put(removelikePost)
router.route("/post/:id/comment").put(addComment)
export default router;