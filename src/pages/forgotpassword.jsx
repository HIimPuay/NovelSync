import React, { useState } from "react";
import "../components/styles/forgotpassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setMessage("If this email is registered, a password reset link has been sent.");
    }, 1000);
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <label htmlFor="email">Email Address:</label>
        <input
          type="email"
          id="email"
          className="box-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <label htmlFor="password">New Password:</label>
        <input
          type="password"
          id="password"
          className="box-input"
          placeholder="Enter new password"
        />
        <label htmlFor="confirm-password">Confirm Password:</label>
        <input
          type="password"
          id="confirm-password"
          className="box-input"
          placeholder="Confirm new password"
        />
        <button type="submit">Reset password</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default ForgotPassword;