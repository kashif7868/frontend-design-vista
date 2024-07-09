import React, { useState, useEffect } from "react";
import { IoCaretBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaCloudUploadAlt, FaFacebook, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../context/authContext";
import defaultUserImage from "../../assets/images/default-user.png";
import "../../assets/css/pagesCss/editProfile.css";
import { createHireDesigner, updateHireDesigner, getHireDesignerById } from '../../app/features/hireDesignerSlice';

const EditHireDesignerProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hireDesignerStatus = useSelector((state) => state.hireDesigner.status);

  const [profilePicture, setProfilePicture] = useState(defaultUserImage);
  const [profileExists, setProfileExists] = useState(false);
  const [formData, setFormData] = useState({
    user: user?.id || '',
    basicInformation: {
      firstName: '',
      lastName: '',
      companyName: '',
      country: '',
      city: '',
      portfolioUrl: '',
    },
    onTheWeb: {
      facebookUsername: '',
      linkedinUsername: '',
      githubUsername: '',
    },
    profilePicture: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const profile = await dispatch(getHireDesignerById(user.id)).unwrap();
          if (profile) {
            setProfileExists(true);
            setFormData({
              user: profile.user || user.id,
              basicInformation: {
                firstName: profile.basicInformation.firstName || '',
                lastName: profile.basicInformation.lastName || '',
                companyName: profile.basicInformation.companyName || '',
                country: profile.basicInformation.country || '',
                city: profile.basicInformation.city || '',
                portfolioUrl: profile.basicInformation.portfolioUrl || '',
              },
              onTheWeb: {
                facebookUsername: profile.onTheWeb.facebookUsername || '',
                linkedinUsername: profile.onTheWeb.linkedinUsername || '',
                githubUsername: profile.onTheWeb.githubUsername || '',
              },
              profilePicture: profile.profilePicture || defaultUserImage,
              id: profile.id || '',
            });
            localStorage.setItem("hireDesignerProfile", JSON.stringify(profile));
          } else {
            setProfileExists(false);
          }
        } catch (error) {
          setProfileExists(false);
        }
      }
    };

    fetchProfile();
  }, [user, dispatch]);

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
        setProfilePicture(reader.result);
        setFormData((prevFormData) => ({
          ...prevFormData,
          profilePicture: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('user', formData.user);

    // Append nested fields individually
    Object.keys(formData.basicInformation).forEach((key) => {
      data.append(`basicInformation[${key}]`, formData.basicInformation[key]);
    });
    Object.keys(formData.onTheWeb).forEach((key) => {
      data.append(`onTheWeb[${key}]`, formData.onTheWeb[key]);
    });

    if (formData.profilePicture) {
      data.append('profilePicture', formData.profilePicture);
    }

    try {
      let response;
      if (profileExists) {
        response = await dispatch(updateHireDesigner({ id: formData.id, data })).unwrap();
      } else {
        response = await dispatch(createHireDesigner(data)).unwrap();
        setFormData((prevFormData) => ({
          ...prevFormData,
          id: response.id, // Update form data with new profile ID
        }));
        setProfileExists(true);
      }
      localStorage.setItem("hireDesignerProfile", JSON.stringify(response));
      navigate('/hire-designer-profile');
      Swal.fire({
        icon: "success",
        title: profileExists ? "Profile Updated" : "Profile Created",
        text: `Your profile has been successfully ${profileExists ? "updated" : "created"}.`,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: profileExists ? "Update Error" : "Creation Error",
        text: error.message || `Failed to ${profileExists ? "update" : "create"} profile`,
      });
    }
  };

  if (!user || hireDesignerStatus === "loading") {
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
                        name="firstName"
                        value={formData.basicInformation.firstName}
                        onChange={(e) => handleNestedChange(e, 'basicInformation')}
                        placeholder=""
                        className="input-u-fname"
                        required
                      />
                      <label className="input-u-label">First Name</label>
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        name="lastName"
                        value={formData.basicInformation.lastName}
                        onChange={(e) => handleNestedChange(e, 'basicInformation')}
                        placeholder=""
                        required
                      />
                      <label className="input-u-label">Last Name</label>
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="companyName"
                      value={formData.basicInformation.companyName}
                      onChange={(e) => handleNestedChange(e, 'basicInformation')}
                      placeholder=""
                      required
                    />
                    <label className="input-u-label">Company Name</label>
                  </div>
                  <div className="form-group-cont">
                    <div className="form-group">
                      <input
                        type="text"
                        name="country"
                        value={formData.basicInformation.country}
                        onChange={(e) => handleNestedChange(e, 'basicInformation')}
                        placeholder=""
                      />
                      <label className="input-u-label">Country</label>
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        name="city"
                        value={formData.basicInformation.city}
                        onChange={(e) => handleNestedChange(e, 'basicInformation')}
                        placeholder=""
                      />
                      <label className="input-u-label">City</label>
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="portfolioUrl"
                      value={formData.basicInformation.portfolioUrl}
                      onChange={(e) => handleNestedChange(e, 'basicInformation')}
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
                          name="facebookUsername"
                          placeholder="Enter username"
                          className="input-u-username"
                          value={formData.onTheWeb.facebookUsername}
                          onChange={(e) => handleNestedChange(e, 'onTheWeb')}
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
                          value={formData.onTheWeb.linkedinUsername}
                          onChange={(e) => handleNestedChange(e, 'onTheWeb')}
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
                          value={formData.onTheWeb.githubUsername}
                          onChange={(e) => handleNestedChange(e, 'onTheWeb')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="save-changes-container">
                <button className="save-changes-btn" onClick={handleSubmit}>
                  {profileExists ? "Update Profile" : "Create Profile"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditHireDesignerProfile;
