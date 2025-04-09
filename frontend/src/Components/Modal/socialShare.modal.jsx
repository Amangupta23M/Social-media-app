import Modal from "@mui/material/Modal";
import SocialShare from "../socialShare";
import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";

const BasicSocialShareModal = (props) => {
  return (
    <div>
      <Modal open={props.open}>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "20rem",
              height: "10rem",
              backgroundColor: "white",
              display: "flex",
              borderRadius: ".5rem",
            }}
          >
            <SocialShare />
            <CancelIcon
              onClick={props.handleClose}
              style={{ fontSize: "1.8rem", cursor: "pointer" }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default BasicSocialShareModal;
