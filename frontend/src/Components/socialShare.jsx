import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
} from "react-share";
import {
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
} from "react-share";

const SocialShare = () => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <FacebookShareButton url="" quote="Check out this post">
        <FacebookIcon size={32} round={true} />
      </FacebookShareButton>
      <TwitterShareButton url="" quote="Check out this post">
        <TwitterIcon size={32} round={true} />
      </TwitterShareButton>
      <WhatsappShareButton url="" quote="Check out this post">
        <WhatsappIcon size={32} round={true} />
      </WhatsappShareButton>
      <LinkedinShareButton
        url="https://www.google.com"
        quote="Check out this post"
      >
        <LinkedinIcon size={32} round={true} />
      </LinkedinShareButton>
    </div>
  );
};
export default SocialShare;
