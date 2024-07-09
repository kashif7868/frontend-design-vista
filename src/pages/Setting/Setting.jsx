import React, { useState } from "react";
import { IoCaretBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import "../../assets/css/pagesCss/settings.css";
import { useAuth } from "../../context/authContext";
import { useDispatch } from "react-redux";
import { deleteHireDesigner } from "../../app/features/hireDesignerSlice";
import { deleteDesignerProfile, clearProfile } from "../../app/features/designerSlice";
import Swal from "sweetalert2";

const Setting = () => {
  const { user, deleteAccount } = useAuth();
  const dispatch = useDispatch();

  const [email, setEmail] = useState(user ? user.email : "");
  const [password, setPassword] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const toggleEmailEdit = () => setIsEditingEmail(!isEditingEmail);
  const togglePasswordEdit = () => setIsEditingPassword(!isEditingPassword);

  const handleSaveEmail = () => {
    // Implement save logic if needed
    toggleEmailEdit();
  };

  const handleCancelEmailEdit = () => {
    setEmail(user ? user.email : "");
    setIsEditingEmail(false);
  };

  const handleSavePassword = () => {
    // Implement save logic if needed
    togglePasswordEdit();
  };

  const handleCancelPasswordEdit = () => {
    setPassword("");
    setIsEditingPassword(false);
  };

  const handleDeleteAccount = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Your account will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteAccount();
          Swal.fire({
            title: "Account Deleted",
            text: "Your account has been successfully deleted.",
            icon: "success",
          });
        } catch (error) {
          Swal.fire({
            title: "Delete Account Error",
            text: error.message,
            icon: "error",
          });
        }
      }
    });
  };

  const handleDeleteHireDesignerProfile = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Your hire designer profile will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Make sure to pass the correct ID
          await dispatch(deleteHireDesigner(user.id)).unwrap();
          Swal.fire({
            title: "Profile Deleted",
            text: "Your hire designer profile has been successfully deleted.",
            icon: "success",
          });
        } catch (error) {
          Swal.fire({
            title: "Delete Profile Error",
            text: error.message,
            icon: "error",
          });
        }
      }
    });
  };

  const handleDeleteDesignerProfile = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Your designer profile will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await dispatch(deleteDesignerProfile(user.id)).unwrap();
          dispatch(clearProfile());
          Swal.fire({
            title: "Profile Deleted",
            text: "Your designer profile has been successfully deleted.",
            icon: "success",
          });
        } catch (error) {
          Swal.fire({
            title: "Delete Profile Error",
            text: error.message,
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <>
      <div className="home-page-back-container">
        <div className="setting-banner">
          <Link to="/">
            <IoCaretBack />
            Back to Home
          </Link>
        </div>
      </div>
      <div className="settings-main-container">
        <div className="setting-side-bar">
          <span className="active">Account Information</span>
          <span onClick={handleDeleteAccount}>Delete Account</span>
          <span onClick={handleDeleteHireDesignerProfile}>
            Delete Hire Designer Profile
          </span>
          <span onClick={handleDeleteDesignerProfile}>
            Delete Designer Profile
          </span>
        </div>
        <div className="setting-container">
          <div className="account-info">
            <h3>ACCOUNT INFORMATION</h3>
            <div className="account-info-container">
              <div className="form-group">
                <div className="info-item">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className={`input-u-email ${
                      isEditingEmail ? "active" : ""
                    }`}
                    value={email}
                    onChange={handleEmailChange}
                    disabled={!isEditingEmail}
                  />
                  {!isEditingEmail ? (
                    <button className="edit-btn-u" onClick={toggleEmailEdit}>
                      Edit
                    </button>
                  ) : (
                    <div className="settings-btn-container">
                      <button
                        className="edit-save-btn"
                        onClick={handleSaveEmail}
                      >
                        Save
                      </button>
                      <button
                        className="edit-cancel-btn"
                        onClick={handleCancelEmailEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <div className="info-item">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className={`input-u-password ${
                      isEditingPassword ? "active" : ""
                    }`}
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={!isEditingPassword}
                  />
                  {!isEditingPassword ? (
                    <button className="edit-btn-u" onClick={togglePasswordEdit}>
                      Edit
                    </button>
                  ) : (
                    <div className="settings-btn-container">
                      <button
                        className="edit-save-btn"
                        onClick={handleSavePassword}
                      >
                        Save
                      </button>
                      <button
                        className="edit-cancel-btn"
                        onClick={handleCancelPasswordEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;
