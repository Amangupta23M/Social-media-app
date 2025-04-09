import { useContext, useRef, useState } from "react";
import "./share.css";
import axios from "axios";
import { PermMedia } from "@mui/icons-material";
import ClipLoader from "react-spinners/ClipLoader";
import { AuthContext } from "./context/authContext";

const override = {
  display: "block",
  margin: "0 60px",

};
export default function Share() {
  const {user}=useContext(AuthContext);
  const desc = useRef();
  const [file, setFile] = useState(null);
  const [shareLoading,setShareLoading] = useState(false);
  const [isImgSelected,setIsImgSelected] = useState(false);
  const [image, setImage] = useState(null);

  const fileSelectorHandler = (e) => {
    
    
      setImage(URL.createObjectURL(e.target.files[0]));
      setFile(e.target.files[0]);
      setIsImgSelected(true)
    
    console.log(file)
  }
  const submitHandler = async (e) => {
    e.preventDefault();
    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      data.append("desc", desc.current.value);
      data.append("userId",user.data.user._id);
      try {
        setShareLoading(true);
        await axios.post("/api/v1/posts/upload", data);
        setShareLoading(false);
        setIsImgSelected(false);
        window.location.reload();
      } catch (err) {
        console.log("Error",err);
      }
    }
 
  };
  return (
    <div className="share">
      <div className="sharewrapper">
        <div className="shareTop">
          <img src={user.data.user.profilePic} alt="" className="shareProfileImg" />
          <input
            placeholder="What's in your mind?"
            className="shareInput"
            ref={desc}
            required
          />
        </div>
        <hr className="sharehr" />
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareoptions">
            <label htmlFor="file" className="shareoption">
              
              {isImgSelected?<img src={image} alt="" style={{width:'3.5rem',height:'3.7rem',borderRadius:'.1rem',objectFit:'contain'}}></img>:<><PermMedia htmlColor="crimson" className="shareicon" /><span className="shareoptiontext">Images & photos</span></>}
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".jpg,.jpeg,.png"
                onChange={fileSelectorHandler}
              />
            </label>

           
          </div>
          {shareLoading?<ClipLoader
  color="#286ff3"
  loading="true"
  cssOverride={override}
  size={25}
  aria-label="Loading Spinner"
  data-testid="loader"/>:<button className="sharebutton" type="submit">
            Share
          </button>
}
        </form>
      </div>
    </div>
  );
}
