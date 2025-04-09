import express from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser,changeCurrentPassword,getCurrentUser,updateAccountDetails,follow, unFollow, isFolllowed, loggedInUser, savePost} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { jwtAuthMiddleware } from "../middlewares/auth.middleware.js";
const router=express.Router()

router.route("/register").post(
    upload.fields([
        {
            name:"profilePic",
            maxCount:1
        },
    ]),
    registerUser
)
router.route("/login").post(loginUser)
router.route("/logout").post(jwtAuthMiddleware,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/updated-password").post(jwtAuthMiddleware,changeCurrentPassword)
router.route("/current-user").get(jwtAuthMiddleware,getCurrentUser)
router.route("/update-userAccount").patch(jwtAuthMiddleware,updateAccountDetails)
router.route("/:id").get(jwtAuthMiddleware,loggedInUser)
router.route("/:id/save").post(jwtAuthMiddleware,savePost)
router.route("/:id/follow").put(jwtAuthMiddleware,follow)
router.route("/:id/unFollow").put(jwtAuthMiddleware,unFollow)
router.route("/:userId/isFollowed").get(jwtAuthMiddleware,isFolllowed)
export default router