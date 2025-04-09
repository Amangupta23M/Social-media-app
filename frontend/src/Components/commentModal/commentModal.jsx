import ClipLoader from "react-spinners/ClipLoader";

import { Box, Button } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import CommentList from "./commentList";
import { io } from "socket.io-client";
import UILoader from "../Skeleton/uiLoader";
import { AuthContext } from "../context/authContext";

const override = {
  display: "block",
  margin: "0 auto",
};
const socket = io("/", {
  reconnection: true,
});

const CommentModal = (props) => {
  const {user}=useContext(AuthContext);
  const[isCommentLoading,setIsCommentLoading] = useState(0);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const userId=user.data.user._id

  const fetchComments = async () => {
    try {
      setIsCommentLoading(1);
      const res = await axios.get(`/api/v1/posts/post/${props.id}`);
        //  console.log(res.data.data.comments);
      setComments(res.data.data.comments.sort((a, b) => {return new Date(b.created) - new Date(a.created)}));
      setIsCommentLoading(0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchComments();
  },[]);

  useEffect(() => {
    // console.log('SOCKET IO', socket);
    socket.on("new-comment", (newComment) => {
      console.log(newComment)
      setComments(newComment.sort((c1,c2)=>{
        return new Date(c2.created) - new Date(c1.created)
      }))
    });
  }, []);

  // add comment
  const addComment = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.put(
        `/api/v1/posts/post/${props.id}/comment`,
        { comment, userId }
      );

      if (data.success === true) {
        setComment("");

        socket.emit("comment", data.data.comments);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflowY: "scroll",
        overflowX: "hidden",
        backgroundColor: "white",
      
      }}
    >
      {isCommentLoading ?<UILoader width={400}/>
      :<>{comments.map((comment) => (
        <CommentList
          key={comment._id}
          name={comment?.postedBy?.fullName} // loggedIn user name will be displayed
          pic={comment?.postedBy?.profilePic}//loggedIn user picture
          createdAt={comment.created}
          text={comment.text}
        />
      ))}</>
    }
      

      {1 ? (
        <>
          <Box sx={{ pt: 1, pl: 3, pb: 3, bgcolor: "white" }}>
            <h3>Add your comment here</h3>
            <form onSubmit={addComment}>
              <textarea
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                placeholder="Add a comment..."
                style={{
                  width: "95%",
                  outline: "none",
                  border: "none",
                  borderBottom: "2px solid gray",
                  resize: "none",
                }}
              />
              <Box sx={{ pt: 1 }}>
                {loading ? (
                  <ClipLoader
                    color="#286ff3"
                    loading="true"
                    cssOverride={override}
                    size={25}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : (
                  <Button type="submit" variant="contained">
                    Comment
                  </Button>
                )}
              </Box>
            </form>
          </Box>
        </>
      ) : (
        <>
          <Link to="/"> Log In to add a comment</Link>
        </>
      )}
    </div>
  );
};

export default CommentModal;
