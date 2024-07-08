import React, { useState, useEffect } from "react";
import { IoCaretBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaCloudUploadAlt, FaFacebook, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../context/authContext";
import defaultUserImage from "../../assets/images/default-user.png";
import "../../assets/css/pagesCss/editProfile.css";
import {
  appendHireDesignerProfileField,
  getHireDesignerById,
  createHireDesignerProfile,
  updateHireDesignerProfile,
} from "../../app/features/hireDesignerSlice";

const EditHireDesignerProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hireDesignerProfile = useSelector((state) => state.hireDesigner.profile);
  const hireDesignerStatus = useSelector((state) => state.hireDesigner.status);

  const [profilePicture, setProfilePicture] = useState(defaultUserImage);
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(getHireDesignerById(user.id))
        .unwrap()
        .then((profile) => {
          if (profile) {
            setProfileExists(true);
            setProfilePicture(profile.profilePicture || defaultUserImage);
          }
        })
        .catch((error) => {
          if (error.statusCode === 404) {
            setProfileExists(false);
            Swal.fire({
              icon: "error",
              title: "Profile Not Found",
              text: "The hire designer profile was not found.",
            });
          }
        });
    }
  }, [user, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(appendHireDesignerProfileField({ name, value }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicture(reader.result);
        dispatch(appendHireDesignerProfileField({ name: "profilePicture", value: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const profileData = { ...hireDesignerProfile, user: user.id };
      await dispatch(createHireDesignerProfile(profileData)).unwrap();
      setProfileExists(true);
      navigate("/hire-designer-profile");
      Swal.fire({
        icon: "success",
        title: "Profile Created",
        text: "Your profile has been successfully created.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Creation Error",
        text: error.message || "Failed to create profile",
      });
    }
  };

  const handleUpdate = async () => {
    try {
      const profileData = { ...hireDesignerProfile, user: user.id };
      await dispatch(updateHireDesignerProfile({ id: user.id, profileData })).unwrap();
      navigate("/hire-designer-profile");
      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been successfully updated.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Error",
        text: error.message || "Failed to update profile",
      });
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const isLoading = hireDesignerStatus === "loading";

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="back-to-profile-container">
        <Link to="/hire-designer-profile">
          <IoCaretBack />
          Back to Profile
        </Link>
      </div>
      <div className="edit-profile-main-container">
        <div className="hire-to-designer">
          <div className="hire-to-designer-information-container">
            <div className="hire-to-designer-sub-side">
              <div className="image-add-con">
                <div className="hire-to-image-change">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="file-input"
                    onChange={handleProfilePictureChange}
                  />
                  <span
                    className="upload-icon"
                    onClick={() => document.querySelector(".file-input").click()}
                  >
                    <FaCloudUploadAlt /> Replace
                  </span>
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="profile-image-preview change-image"
                  />
                </div>
              </div>
              <div className="hire-to-designer-sub-side">
                <div className="basic-info-form-container">
                  <div className="form-group-cont">
                    <div className="form-group">
                      <input
                        type="text"
                        name="basicInformation.firstName"
                        value={hireDesignerProfile.basicInformation.firstName || ""}
                        onChange={handleChange}
                        placeholder=""
                        className="input-u-fname"
                      />
                      <label className="input-u-label">First Name</label>
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        name="basicInformation.lastName"
                        value={hireDesignerProfile.basicInformation.lastName || ""}
                        onChange={handleChange}
                        placeholder=""
                      />
                      <label className="input-u-label">Last Name</label>
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="basicInformation.companyName"
                      value={hireDesignerProfile.basicInformation.companyName || ""}
                      onChange={handleChange}
                      placeholder=""
                      required
                    />
                    <label className="input-u-label">Company Name</label>
                  </div>
                  <div className="form-group-cont">
                    <div className="form-group">
                      <input
                        type="text"
                        name="basicInformation.country"
                        value={hireDesignerProfile.basicInformation.country || ""}
                        onChange={handleChange}
                        placeholder=""
                      />
                      <label className="input-u-label">Country</label>
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        name="basicInformation.city"
                        value={hireDesignerProfile.basicInformation.city || ""}
                        onChange={handleChange}
                        placeholder=""
                      />
                      <label className="input-u-label">City</label>
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="basicInformation.portfolioUrl"
                      value={hireDesignerProfile.basicInformation.portfolioUrl || ""}
                      onChange={handleChange}
                      placeholder=""
                    />
                    <label className="input-u-label">Portfolio URL</label>
                  </div>
                </div>
                <div className="on-the-web-container">
                  <div className="on-web-link">
                    <h2>ON THE WEB</h2>
                    <div className="social-link">
                      <div className="social-list">
                        <div className="social-icon">
                          <FaFacebook />
                        </div>
                        <input
                          type="text"
                          name="onTheWeb.facebookUsername"
                          placeholder="Enter username"
                          className="input-u-username"
                          value={hireDesignerProfile.onTheWeb.facebookUsername || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="social-list">
                        <div className="social-icon">
                          <FaLinkedinIn />
                        </div>
                        <input
                          type="text"
                          name="onTheWeb.linkedinUsername"
                          placeholder="Enter username"
                          className="input-u-username"
                          value={hireDesignerProfile.onTheWeb.linkedinUsername || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="social-list">
                        <div className="social-icon">
                          <FaGithub />
                        </div>
                        <input
                          type="text"
                          name="onTheWeb.githubUsername"
                          placeholder="Enter username"
                          className="input-u-username"
                          value={hireDesignerProfile.onTheWeb.githubUsername || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="save-changes-container">
                {!profileExists ? (
                  <button className="save-changes-btn" onClick={handleSave}>
                    Create Profile
                  </button>
                ) : (
                  <button className="save-changes-btn" onClick={handleUpdate}>
                    Update Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditHireDesignerProfile;
