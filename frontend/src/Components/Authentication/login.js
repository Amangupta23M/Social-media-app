import React, { useState, useEffect,useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { AuthContext } from "../context/authContext";

const Login = () => {
  const { login } = useContext(AuthContext); 
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Floating leaves and bubbles
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

    // Cleanup when component unmounts
    return () => {
      document.querySelectorAll(".leaf").forEach((leaf) => leaf.remove());
      document.querySelectorAll(".bubble").forEach((bubble) => bubble.remove());
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/api/v1/users/login", formData, {
        withCredentials: true,
      });
    // Assuming the response contains user data (e.g., token, user info)
    const userData = response.data;
     login(userData)
      setMessage(response.data.message || "Login successful!");
      navigate("/home");
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
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
            placeholder="Enter your password"
            required
          />
        </div>

        <button className="login-button" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        
      <button
        className="signup-navigate-button"
        onClick={() => navigate("/signup")}
      >
        Sign Up
      </button>
      </form>


      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Login;
