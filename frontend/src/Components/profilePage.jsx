import React, { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "./context/authContext";
import FollowerFollowingCard from "./followerfollowingCard";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./profilePage.css";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [posts, setPosts] = useState([]); // State to store posts
  const [isLoading, setIsLoading] = useState(true);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/api/v1/users/${user.data.user._id}`);
        setFollowers(response.data.followers);
        setFollowing(response.data.following);
        const allPosts=await axios.get(`/api/v1/posts/post`)
        const loggedInUserPosts=allPosts.data.data.filter((post)=>post.userId._id===user.data.user._id);
        setPosts(loggedInUserPosts);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user details", error);
        setIsLoading(false);
      }
     
    };

    fetchUserDetails();
  }, [user]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="profilePage">
      <div className="profileHeader">
        <motion.div
          className="profileInfo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={user.data.user.profilePic}
            alt="profile"
            className="profilePic"
            onClick={() => navigate("/home")}
          />
          <h2>{user.data.user.fullName}</h2>
          <p>{user.data.user.email}</p>
        </motion.div>
      </div>
      <div className="followersFollowingSection">
        <div className="dropdown">
          <button
            onClick={() => setShowFollowers((prev) => !prev)}
            className="dropdownButton"
          >
            {showFollowers ? "Followers" : "Followers"}
          </button>
          <div className={`dropdownContent ${showFollowers ? "show" : ""}`}>
            {followers.length > 0 ? (
              followers.map((follower) => (
                <FollowerFollowingCard key={follower._id} user={follower} />
              ))
            ) : (
              <p>No followers yet.</p>
            )}
          </div>
        </div>

        <div className="dropdown">
          <button
            onClick={() => setShowFollowing((prev) => !prev)}
            className="dropdownButton"
          >
            {showFollowing ? "Following" : "Following"}
          </button>
          <div className={`dropdownContent ${showFollowing ? "show" : ""}`}>
            {following.length > 0 ? (
              following.map((followedUser) => (
                <FollowerFollowingCard key={followedUser._id} user={followedUser} />
              ))
            ) : (
              <p>Not following anyone yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="postsSection">
        <h3 style={{paddingLeft:'20px'}}>Posts</h3>
        <div className="postsGrid">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="postCard">
                <img src={post.img} alt="post" className="postImage" />
                <p>{post.desc}</p>
              </div>
            ))
          ) : (
            <p>No posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
