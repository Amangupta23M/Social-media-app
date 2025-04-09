import React from "react"
import { motion } from "framer-motion";

export default function FollowerFollowingCard({ user }) {

  return (
    <motion.div className="followerCard" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
      <div className="followerInfo">
        <img src={user.profilePic} alt={user.fullName} className="followerPic" />
          <h4>{user.fullName}</h4>
      </div>
    </motion.div>
  );
}
