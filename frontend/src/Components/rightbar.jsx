import "./rightbar.css";
import axios from "axios";
import { useEffect, useState } from "react";
import TrendingNews from "./trendingnews";
// import Post from './post'
const Rightbar = () => {
  const [Trendingnews, setTrendingNews] = useState([]);
  useEffect(() => {
    const fetchNews = async () => {
      const res = await axios.get(
        "https://newsapi.org/v2/top-headlines?sources=google-news-in&apiKey=c3529205a4f14c158b2d47b592c63ab4"
      );
      setTrendingNews(res.data.articles);
      console.log(Trendingnews)
    };
    fetchNews();
  }, []);
  return (
    <>
      <div className="rightbarContainer">
        <div className="rightbarBottom">
          <h3 style={{color:'black'}}>Trending News</h3>
          <hr />
          <div className="trendingNews">
            {Trendingnews?.map((n) => (
              <TrendingNews news={n}/>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default Rightbar;
