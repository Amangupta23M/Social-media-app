import "./post.css";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
// import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import TelegramIcon from "@mui/icons-material/Telegram";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { format } from "timeago.js";
// import BookmarkIcon from "@mui/icons-material/Bookmark";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import BasicCommentModal from "./Modal/comment.modal";
import BasicSocialShareModal from "./Modal/socialShare.modal";
import { AuthContext } from "./context/authContext";
import { io } from "socket.io-client";

const socket = io("/", { reconnection: true });

export default function Post(props) {
  const { user } = useContext(AuthContext);
  const [showSocialShare, setShowSocialShare] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  // const [isSaved, setIsSaved] = useState(props.post.isSaved);
  const [open, setOpen] = useState(false);

  const userId = user.data.user._id;

  // Fetch initial follow state and listen for socket events
  useEffect(() => {
    const fetchFollowState = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/users/${props.post.userId._id}/isFollowed`,
          { params: { userId } }
        );
        setIsFollowed(data.isFollowed);
      } catch (error) {
        console.error("Error fetching follow state:", error);
      }
    };

    fetchFollowState();

    // Listen for follow/unfollow events
    socket.on("followed", ({ followerId, followedId }) => {
      if (followedId === userId) setIsFollowed(true);
    });

    socket.on("unfollowed", ({ followerId, followedId }) => {
      if (followedId === userId) setIsFollowed(false);
    });

    return () => {
      socket.off("followed");
      socket.off("unfollowed");
    };
  }, [props.post.userId._id, userId]);

  const handleSocialShare = () => {
    setShowSocialShare((prev) => !prev);
  }

  const handleFollow = async () => {
    const followedId = props.post.userId._id;

    try {
      if (isFollowed) {
        await axios.put(`/api/v1/users/${followedId}/unFollow`, { userId });
        socket.emit("unfollowed", { followerId: userId, followedId });
      } else {
        await axios.put(`/api/v1/users/${followedId}/follow`, { userId });
        socket.emit("followed", { followerId: userId, followedId });
      }
      setIsFollowed(!isFollowed);
    } catch (error) {
      console.error("Error updating follow state:", error);
    }
  };

  // const handleSave = async (e) => {
  //   e.preventDefault();
  //   const postId = props.id;

  //   try {
  //     const { data } = await axios.put(`/api/v1/users/${postId}/save`,{userId});
  //     setIsSaved(data.data.isSaved);
  //   } catch (error) {
  //     console.error("Error saving post:", error);
  //   }
  // };

  const AddLike = async () => {
    try {
      const postId = props.id;
      await axios.put(`/api/v1/posts/post/${postId}/addlike`, { userId });
      if (props.isFromSaved) props.fetchPosts();
    } catch (error) {
      console.error("Error adding like:", error);
    }
  };

  const RemoveLike = async () => {
    try {
      await axios.put(`/api/v1/posts/post/${props.id}/removelike`, { userId });
      if (props.isFromSaved) props.fetchPosts();
    } catch (error) {
      console.error("Error removing like:", error);
    }
  };

   const handleClose=()=>{
     setShowSocialShare(false)
   }
  return (
    <div className="post">
      <div className="postwrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <img
              className="postProfileImg"
              src={props.post.userId.profilePic}
              alt=""
            />
            <span className="postUsername">{props.post.userId.fullName}</span>
            <span className="postDate">{format(props.post.createdAt)}</span>
            {userId !== props.post.userId._id && (
              <span
                className="postFollow"
                style={{ color: isFollowed ? "green" : "#1877f2" }}
                onClick={handleFollow}
              >
                {isFollowed ? "Following" : "Follow"}
              </span>
            )}
          </div>
          {/* <div className="postTopRight">
            {isSaved ? (
              <BookmarkIcon htmlColor="#164863" onClick={handleSave} />
            ) : (
              <BookmarkBorderIcon className="saved" onClick={handleSave} />
            )}
          </div> */}
        </div>
        <div className="postCenter">
          <span className="posttext">{props.post.desc}</span>
          <img src={props.post.img} alt="" className="postimg" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            {props.post.likes.includes(userId) ? (
              <FavoriteIcon
                htmlColor="crimson"
                className="postlikeicon"
                onClick={RemoveLike}
              />
            ) : (
              <FavoriteBorderIcon
                htmlColor="black"
                className="postlikeicon"
                onClick={AddLike}
              />
            )}
            <span className="postlikecounter">{props.post.likes.length}</span>
            <TelegramIcon className="postshareicon" onClick={handleSocialShare} />
            {showSocialShare && (
              <BasicSocialShareModal id={props.id} open={true}  handleClose={handleClose}/>
            )}
          </div>
          <div className="postBottomRight">
            <ModeCommentOutlinedIcon
              htmlColor="black"
              className="postcommenticon"
              onClick={() => {
                setShowComments(true)
                setOpen(true)
              }}
            />
            <span className="postcommenttext">
              {props.post.comments.length} comments
            </span>
          </div>
        </div>
        {showComments && (
          <BasicCommentModal
            Img={props.post.img}
            id={props.id}
            open={open}
            handleClose={() => {setShowComments(false)
              setOpen(false)
            }}
          />
        )}
      </div>
    </div>
  );
}
