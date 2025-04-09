import "./save.css";
import { useContext, useEffect, useState } from "react";
import Sidebar from "../sidebar";
import axios from "axios";
import Post from "../post";
import { AuthContext } from "../context/authContext";

const Saved = () => {
  const { user } = useContext(AuthContext); // Get logged-in user
  const [savedPost, setSavedPost] = useState([]);
  const [isFromSaved, setIsFromSaved] = useState(true);

  const fetchSavedPosts = async () => {
    if (!user) {
      console.log("User not logged in");
      return;
    }

    try {
      const res = await axios.get(`/api/v1/users/post`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const savedPosts = res.data.data;
      setSavedPost(
        savedPosts.sort((p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt))
      );
    } catch (err) {
      console.error("Error fetching saved posts:", err);
    }
  };

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  return (
    <div className="save">
      <div className="saveWrapper">
        <div className="saveLeft">
          <Sidebar />
        </div>
        <div className="saveRight">
          <div className="saveRightWrapper">
            {savedPost.length > 0 ? (
              savedPost.map((p) => (
                <Post key={p._id} id={p._id} post={p} fetchPosts={fetchSavedPosts} isFromSaved={isFromSaved} />
              ))
            ) : (
              <p>No saved posts found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Saved;
