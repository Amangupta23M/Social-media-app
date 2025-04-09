import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./signup.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    profilePic: "",
    gender: "",
  });

  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Generate floating leaves and bubbles on component mount
  useEffect(() => {
    const createLeaf = () => {
      const leaf = document.createElement("div");
      leaf.classList.add("leaf");
      leaf.style.left = `${Math.random() * 100}%`;
      leaf.style.animationDuration = `${10 + Math.random() * 10}s`;
      leaf.style.animationDelay = `${Math.random() * 5}s`;
      leaf.style.transform = `rotate(${Math.random() * 360}deg)`;
      document.body.appendChild(leaf);
    };

    const createBubble = () => {
      const bubble = document.createElement("div");
      bubble.classList.add("bubble");
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.animationDuration = `${5 + Math.random() * 3}s`;
      bubble.style.animationDelay = `${Math.random() * 3}s`;
      document.body.appendChild(bubble);
    };

    // Create multiple leaves and bubbles
    for (let i = 0; i < 10; i++) {
      createLeaf();
      createBubble();
    }

    // Cleanup leaves and bubbles when component unmounts
    return () => {
      const leaves = document.querySelectorAll(".leaf");
      leaves.forEach((leaf) => leaf.remove());
      const bubbles = document.querySelectorAll(".bubble");
      bubbles.forEach((bubble) => bubble.remove());
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePic: file });
    setProfilePicPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("fullName", formData.fullName);
    form.append("email", formData.email);
    form.append("password", formData.password);
    if (formData.profilePic) {
      form.append("profilePic", formData.profilePic);
    }
    form.append("gender", formData.gender);

    try {
      const response = await axios.post("/api/v1/users/register", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(response.data.message || "Signup successful!");
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="profilePic">Profile Picture</label>
          <input
            type="file"
            id="profilePic"
            name="profilePic"
            accept="image/*"
            onChange={handleFileChange}
          />
          {profilePicPreview && (
            <img
              src={profilePicPreview}
              alt="Profile Preview"
              className="profile-pic-preview"
            />
          )}
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button type="submit">Sign Up</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default SignUp;
