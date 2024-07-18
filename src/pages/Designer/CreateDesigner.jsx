import React, { useState, useEffect } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { FaFacebook, FaLinkedinIn, FaGithub } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import defaultUserImage from "../../assets/images/default-user.png";
import "../../assets/css/pagesCss/editProfile.css";

const CreateDesigner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(defaultUserImage);
  const [formData, setFormData] = useState({
    basicInformation: {
      firstName: "",
      lastName: "",
      categoryName: "",
      country: "",
      city: "",
      portfolioUrl: "",
    },
    onTheWeb: {
      facebookUsername: "",
      linkedinUsername: "",
      githubUsername: "",
    },
    aboutMe: {
      sectionTitle: "",
      description: "",
    },
    workExperience: {
      companyName: "",
      position: "",
      startingFrom: "",
      endingIn: "",
      details: "",
    },
  });

  useEffect(() => {
    if (user) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        user: user.id,
      }));
    }
  }, [user]);

  const handleNestedChange = (e, category) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [category]: {
        ...prevFormData[category],
        [name]: value,
      },
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        setProfilePicture(result);
        setFormData((prevFormData) => ({
          ...prevFormData,
          profilePicture: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("user", user.id);
      formDataToSend.append("profilePicture", formData.profilePicture);
      Object.keys(formData.basicInformation).forEach((key) => {
        formDataToSend.append(`basicInformation[${key}]`, formData.basicInformation[key]);
      });
      Object.keys(formData.onTheWeb).forEach((key) => {
        formDataToSend.append(`onTheWeb[${key}]`, formData.onTheWeb[key]);
      });
      Object.keys(formData.aboutMe).forEach((key) => {
        formDataToSend.append(`aboutMe[${key}]`, formData.aboutMe[key]);
      });
      Object.keys(formData.workExperience).forEach((key) => {
        formDataToSend.append(`workExperience[${key}]`, formData.workExperience[key]);
      });

      const response = await axios.post("http://localhost:3000/api/designers/", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Profile Created",
        text: "Your profile has been successfully created.",
      });

      navigate(`/designer-profile/${response.data.id}`);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Creation Error",
        text: error.message || "Failed to create profile",
      });
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
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
                  style={{ display: "none" }}
                />
                <span
                  className="upload-icon"
                  onClick={() =>
                    document.querySelector(".file-input").click()
                  }
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
                      name="firstName"
                      value={formData.basicInformation?.firstName || ""}
                      onChange={(e) =>
                        handleNestedChange(e, "basicInformation")
                      }
                      placeholder=""
                      className="input-u-fname"
                    />
                    <label className="input-u-label">First Name</label>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.basicInformation?.lastName || ""}
                      onChange={(e) =>
                        handleNestedChange(e, "basicInformation")
                      }
                      placeholder=""
                    />
                    <label className="input-u-label">Last Name</label>
                  </div>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="categoryName"
                    value={formData.basicInformation?.categoryName || ""}
                    onChange={(e) =>
                      handleNestedChange(e, "basicInformation")
                    }
                    placeholder=""
                    required
                  />
                  <label className="input-u-label">Category Name</label>
                </div>
                <div className="form-group-cont">
                  <div className="form-group">
                    <input
                      type="text"
                      name="country"
                      value={formData.basicInformation?.country || ""}
                      onChange={(e) =>
                        handleNestedChange(e, "basicInformation")
                      }
                      placeholder=""
                    />
                    <label className="input-u-label">Country</label>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="city"
                      value={formData.basicInformation?.city || ""}
                      onChange={(e) =>
                        handleNestedChange(e, "basicInformation")
                      }
                      placeholder=""
                    />
                    <label className="input-u-label">City</label>
                  </div>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="portfolioUrl"
                    value={formData.basicInformation?.portfolioUrl || ""}
                    onChange={(e) =>
                      handleNestedChange(e, "basicInformation")
                    }
                    placeholder=""
                  />
                  <label className="input-u-label">Portfolio URL</label>
                </div>
              </div>
              <div className="on-the-web-container">
                <div className="on-web-link">
                  <h2>ON THE WEB</h2>
                  <p>
                    <MdOutlineVerifiedUser /> Verified Accounts
                  </p>
                  <p>
                    Build trust with your network by verifying your social
                    profiles
                  </p>
                  <div className="social-link">
                    <div className="social-list">
                      <div className="social-icon">
                        <FaFacebook />
                      </div>
                      <input
                        type="text"
                        name="facebookUsername"
                        placeholder="Enter username"
                        className="input-u-username"
                        value={formData.onTheWeb?.facebookUsername || ""}
                        onChange={(e) => handleNestedChange(e, "onTheWeb")}
                      />
                    </div>
                    <div className="social-list">
                      <div className="social-icon">
                        <FaLinkedinIn />
                      </div>
                      <input
                        type="text"
                        name="linkedinUsername"
                        placeholder="Enter username"
                        className="input-u-username"
                        value={formData.onTheWeb?.linkedinUsername || ""}
                        onChange={(e) => handleNestedChange(e, "onTheWeb")}
                      />
                    </div>
                    <div className="social-list">
                      <div className="social-icon">
                        <FaGithub />
                      </div>
                      <input
                        type="text"
                        name="githubUsername"
                        placeholder="Enter username"
                        className="input-u-username"
                        value={formData.onTheWeb?.githubUsername || ""}
                        onChange={(e) => handleNestedChange(e, "onTheWeb")}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="about-container">
                <h2>ABOUT ME</h2>
                <div className="about-form">
                  <div className="form-group-about-container">
                    <div className="form-group">
                      <input
                        type="text"
                        name="sectionTitle"
                        value={formData.aboutMe?.sectionTitle || ""}
                        onChange={(e) => handleNestedChange(e, "aboutMe")}
                        placeholder=""
                        className="input-u-section-title"
                      />
                      <label className="input-u-label">Section Title</label>
                    </div>
                    <div className="form-group">
                      <textarea
                        name="description"
                        value={formData.aboutMe?.description || ""}
                        onChange={(e) => handleNestedChange(e, "aboutMe")}
                        placeholder=""
                        className="input-u-description"
                      ></textarea>
                      <label className="input-u-label-description">
                        Description
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="work-experience-container">
                <h2>WORK EXPERIENCE</h2>
                <div className="from-experience-container">
                  <div className="form-group">
                    <input
                      type="text"
                      name="companyName"
                      value={formData.workExperience?.companyName || ""}
                      onChange={(e) =>
                        handleNestedChange(e, "workExperience")
                      }
                      placeholder=""
                      className="input-u-company-name"
                    />
                    <label className="input-u-label">Company Name</label>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="position"
                      value={formData.workExperience?.position || ""}
                      onChange={(e) =>
                        handleNestedChange(e, "workExperience")
                      }
                      placeholder=""
                      className="input-u-position"
                    />
                    <label className="input-u-label">Position</label>
                  </div>
                  <div className="form-group-cont">
                    <div className="form-group">
                      <input
                        type="date"
                        name="startingFrom"
                        value={formData.workExperience?.startingFrom || ""}
                        onChange={(e) =>
                          handleNestedChange(e, "workExperience")
                        }
                        placeholder=""
                        className="input-u-start-date"
                      />
                      <label className="input-u-label">Starting From</label>
                    </div>
                    <div className="form-group">
                      <input
                        type="date"
                        name="endingIn"
                        value={formData.workExperience?.endingIn || ""}
                        onChange={(e) =>
                          handleNestedChange(e, "workExperience")
                        }
                        placeholder=""
                        className="input-u-end-date"
                      />
                      <label className="input-u-label">Ending In:</label>
                    </div>
                  </div>
                  <div className="form-group">
                    <textarea
                      name="details"
                      value={formData.workExperience?.details || ""}
                      onChange={(e) =>
                        handleNestedChange(e, "workExperience")
                      }
                      placeholder=""
                      className="input-u-details"
                    ></textarea>
                    <label className="input-u-label-details">Details:</label>
                  </div>
                </div>
              </div>
              <div className="save-changes-container">
                <button
                  className="save-changes-btn"
                  onClick={handleSubmit}
                >
                  Create Designer Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDesigner;
