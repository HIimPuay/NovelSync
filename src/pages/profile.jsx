import React from "react";
import "../components/styles/profile.css";

function Profile() {
  return (
    <div className="profile-container">
      <div className="profile-image"></div>
      <h2 className="username">Username</h2>

      <div className="button-group">
        <button className="profile-button">Edit name</button>
        <button className="profile-button">Edit profile</button>
      </div>
    </div>
  );
}

export default Profile;
