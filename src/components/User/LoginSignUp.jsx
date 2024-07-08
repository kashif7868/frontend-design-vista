import React, { useState } from "react";
import { useAuth } from "../../context/authContext"; // Import useAuth
import "../../assets/css/loginSignup.css";
import logoImage from "../../assets/images/logoW.png";

const LoginSignUp = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: ""
  });
  const { signUp, login } = useAuth(); // Get signUp and login functions from context

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: ""
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await signUp({
          firstName: formData.firstName,
          lastName: formData.lastName,
          userName: formData.userName,
          email: formData.email,
          password: formData.password
        });
      } else {
        await login({ email: formData.email, password: formData.password });
      }
    } catch (error) {
      console.error("Authentication failed", error);
    }
  };

  return (
    <div className={`container ${isSignUp ? "active" : ""}`} id="container">
      <div className="form-container sign-up">
        <form onSubmit={handleSubmit}>
          <h1>Create Account</h1>
          <span>or use your email for registration</span>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
            value={formData.firstName}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            value={formData.lastName}
          />
          <input
            type="text"
            name="userName"
            placeholder="Username"
            onChange={handleChange}
            value={formData.userName}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <div className="form-container sign-in">
        <form onSubmit={handleSubmit}>
          <h1>Sign In</h1>
          <span>or use your email and password</span>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
          />
          <button type="submit">Sign In</button>
        </form>
      </div>
      <div className="toggle-container">
        <div className="toggle">
          <div
            className={`toggle-panel toggle-left ${isSignUp ? "" : "hidden"}`}
          >
            <img src={logoImage} alt="" />
            <p>Enter your personal details to use all site features</p>
            <button id="login" onClick={toggleForm}>
              Sign In
            </button>
          </div>
          <div
            className={`toggle-panel toggle-right ${isSignUp ? "hidden" : ""}`}
          >
            <img src={logoImage} alt="" />
            <p>Register with your personal details to use all site features</p>
            <button id="register" onClick={toggleForm}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;
