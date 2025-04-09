import React from 'react';
import './commentList.css';
import {format} from 'timeago.js';
const CommentList = ({ pic,name, text,createdAt }) => {
    return (
        
        <div>
            <div className="comment">
                <div className="comment-author">
                    <img src={pic} alt="Avatar" style={{display:'flex',width:"2.5rem",height:'2.5rem',borderRadius:'50%',objectFit:'cover'}}/>
                  
                </div>
                <div className="comment-text">
                    <div className='commentedBy'>
                    {name?<p>{name}</p>:<p>Anonymous</p>}
                    <p style={{marginLeft:'10px',color:"grey",fontWeight:400}}>{format(createdAt)}</p>
                    </div>
                    {text}
                </div>
               </div>
        </div>
    );
}

export default CommentList;