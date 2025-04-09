import Modal from "@mui/material/Modal";
import CommentModal from "../commentModal/commentModal";
import React from "react";
import CancelIcon from '@mui/icons-material/Cancel';

export default function BasicCommentModal(props) {
  return (
    <div>
      <Modal open={props.open}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            alignItems: "center",
          }}
          
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "70%",
              height: "80%",
              backgroundColor: "white",
              
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
            
                <img
                  src={props.Img}
                  alt=""
                  style={{
                    width: "29rem",
                    height: "100%",
                    objectFit: "cover",
                  }}
                ></img>
              
            </div>
            <div style={{ width: "30rem" ,display:'flex'}}>
            
              <CommentModal id={props.id} />
              <CancelIcon onClick={props.handleClose} style={{fontSize:'1.8rem',cursor:'pointer'}}/>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
