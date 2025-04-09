import { useState, useEffect } from "react";
import "./feed.css";
import Share from "./share";
import Post from "./post";
import axios from "axios";
import {io} from "socket.io-client";
import UILoader from "./Skeleton/uiLoader";
const socket=io("/",{
  reconnection:true
})

const Feed = () => {
  const [isPostLoading, setIsPostLoading] = useState(false);
  const [posts, setPosts] = useState([]);
 
  const fetchPosts = async () => {
    setIsPostLoading(true);
    const res = await axios.get(
      "/api/v1/posts/post"
    );
    setPosts(res.data.data.sort((p1, p2) =>{
      return new Date(p2.createdAt) - new Date(p1.createdAt)
    }));
    setIsPostLoading(false);
  };
  useEffect(() => {
    fetchPosts();
  }, []);


   const HandleTrending = async () => {
    const res = await axios.get(
      "/api/v1/posts/post"
    );
    setPosts(res.data.data.sort((p1, p2) =>{
      return p2.comments.length - p1.comments.length

    }));
    document.getElementById("optionItem1").style.borderBottom = "2px solid gray";
    document.getElementById("optionItem2").style.borderBottom = ""
   
   }


    const HandleLatest = async () => {
      const res = await axios.get(
        "/api/v1/posts/post"
      );
      setPosts(res.data.data.sort((p1, p2) =>{
        return new Date(p2.createdAt) - new Date(p1.createdAt)
      }));
      document.getElementById("optionItem2").style.borderBottom = "2px solid gray";
      document.getElementById("optionItem1").style.borderBottom = ""
    
    }


    useEffect(() => {
      socket.on("add-like",(newPosts)=>{
         setPosts(newPosts.sort((p1,p2)=>{
          return new Date(p2.createdAt) - new Date(p1.createdAt)
         }))
      })
      socket.on("remove-like",(newPosts)=>{
        setPosts(newPosts.sort((p1,p2)=>{
          return new Date(p2.createdAt) - new Date(p1.createdAt)
         }))
    
      })
  },[])
 
  
  return (
    <div className="feed">
      <div className="feedwrapper">
        <Share />
        <div className="optionWrapper">
          <div className="optionItem" id="optionItem1" onClick={HandleTrending}>Trending</div>
          <div className="optionItem" id="optionItem2" onClick={HandleLatest}>Latest</div>
        
        </div>
        {isPostLoading?<UILoader width={700}/>: <>{posts.map((p) => (
          <Post key={p._id} id={p._id} post={p}  />
        ))}</>
        }
       
      </div>
    </div>
  );
};
export default Feed;
