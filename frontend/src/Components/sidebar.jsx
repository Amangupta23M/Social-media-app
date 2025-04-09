import "./sidebar.css";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import BookmarkIcon from "@mui/icons-material/Bookmark";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/authContext";
export default function Sidebar() {
  const {user,logout}=useContext(AuthContext)
  const navigate=useNavigate()
  return (
    <div className="sidebar">
      <div className="sidebarwrapper">
        <ul className="sidebarlist">
          <div className="ProfileTop" onClick={()=>navigate("/home")}>
            <img src={user.data.user.profilePic} className="ProfileImg" alt=""></img>
            <h3 style={{  color: '#164863',fontSize:'24px'}}>{user.data.user.fullName}</h3>
          </div>
          <hr style={{ marginBottom:12 }} />
        
          <li className="sidebarlistitem" onClick={()=>navigate("/profile")}>
            <AccountCircleIcon className="sidebaricon" />
            <span className="sidebarlistitemtext">Profile</span>
          </li>
          <li className="sidebarlistitem">
          <ChatBubbleIcon className="sidebaricon" />
          <span className="sidebarlistitemtext">Chat</span>
          </li>
          <li className="sidebarlistitem">
            <BookmarkIcon />
            <span className="sidebarlistitemtext"><Link to='/saved' style={{color:"#164863",textDecoration:"none"}} >Saved</Link></span>
          </li>
          <li className="sidebarlistitem">
            <NotificationsIcon />
            <span className="sidebarlistitemtext">Notification</span>
          </li>
          <li className="sidebarlistitem" onClick={logout}>
            <LogoutIcon />
            <span className="sidebarlistitemtext" >Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
