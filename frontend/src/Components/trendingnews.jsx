import './trendingnews.css';
const TrendingNews=(props)=>{
    
    return(
            <div className="trending-news-container">
                <a href={props.news?.url} className="trending-news-item">
                    <p style={{width:'95%'}}>{props.news?.description}</p>
                    <hr style={{width:'100%'}}/>
                </a> 
            </div>
    );
}
export default TrendingNews;