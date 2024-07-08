import React, { useState, useEffect } from "react";
import { MdLocationPin, MdEdit, MdDownloadForOffline } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../../context/authContext";
import { Link } from "react-router-dom";
import defaultUserImage from "../../assets/images/default-user.png";
import { FaFacebook, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { getHireDesignerById } from "../../app/features/hireDesignerSlice";
import {
  createCoverImage,
  deleteCoverImage,
  updateCoverImage,
  clearBannerImage,
  fetchCoverImageById,
} from "../../app/features/coverBannerSlice";
import { toast } from "react-toastify";
import "../../assets/css/pagesCss/profile.css";
import Status from "../Service/Status";

const HireDesignerProfile = ({ coverImageId }) => {
  const [activeLink, setActiveLink] = useState("status");
  const { user, role } = useAuth();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.hireDesigner.profile);
  const status = useSelector((state) => state.hireDesigner.status);

  const bannerImage = useSelector((state) => state.coverBanner.bannerImage);
  const coverBannerStatus = useSelector((state) => state.coverBanner.status);
  const currentCoverImageId = useSelector(
    (state) => state.coverBanner.coverImageId
  );

  useEffect(() => {
    if (user && user.id && role === "hireDesigner") {
      const storedProfile = localStorage.getItem("hireDesignerProfile");
      if (storedProfile) {
        dispatch({
          type: "hireDesigner/getHireDesignerById/fulfilled",
          payload: JSON.parse(storedProfile),
        });
      } else {
        dispatch(getHireDesignerById(user.id));
      }
    }
  }, [user, role, dispatch]);

  useEffect(() => {
    const storedBannerImage = localStorage.getItem("bannerImage");
    const storedCoverImageId = localStorage.getItem("coverImageId");

    if (storedBannerImage && storedCoverImageId) {
      dispatch({
        type: "coverBanner/fetchCoverImageById/fulfilled",
        payload: { image: storedBannerImage, id: storedCoverImageId },
      });
    } else if (user && user.id && role === "hireDesigner") {
      if (coverImageId) {
        dispatch(fetchCoverImageById(coverImageId));
      } else {
        dispatch(clearBannerImage());
      }
    }
  }, [coverImageId, dispatch, user, role]);

  if (!user || !user.id || status === "loading" || coverBannerStatus === "loading") {
    return <div>Loading...</div>;
  }

  const handleBannerUpload = (event) => {
    const file = event.target.files[0];
    if (file && user && user.id) {
      dispatch(createCoverImage({ userId: user.id, imageFile: file }))
        .unwrap()
        .then(() => {
          toast.success("Banner image uploaded successfully!");
        })
        .catch((error) => {
          console.error("Error uploading banner image:", error);
          toast.error("Failed to upload banner image");
        });
    }
  };

  const handleRemoveBanner = () => {
    if (currentCoverImageId && user && user.id) {
      dispatch(deleteCoverImage(currentCoverImageId))
        .unwrap()
        .then(() => {
          toast.success("Banner image removed successfully!");
        })
        .catch((error) => {
          console.error("Error removing banner image:", error);
          toast.error("Failed to remove banner image");
        });
    }
  };

  const handleReplaceBanner = (event) => {
    const file = event.target.files[0];
    if (file && user && user.id) {
      if (currentCoverImageId) {
        dispatch(
          updateCoverImage({
            coverImageId: currentCoverImageId,
            imageFile: file,
          })
        )
          .unwrap()
          .then(() => {
            toast.success("Banner image replaced successfully!");
          })
          .catch((error) => {
            console.error("Error replacing banner image:", error);
            toast.error("Failed to replace banner image");
          });
      } else {
        toast.error("No cover image ID found. Please upload an image first.");
      }
    }
  };

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString();
  };

  const renderPage = () => {
    switch (activeLink) {
      case "status":
        return <Status />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="profile-banner">
        {bannerImage ? (
          <div className="banner-wrapper">
            <img src={bannerImage} alt="Banner" className="banner-image" />
            <div className="banner-controls">
              <h3>Replace Banner Image</h3>
              <span>Optimal dimensions 3200 x 410px</span>
              <div className="banner-control-container">
                <label htmlFor="banner-replace" className="replace-image">
                  Replace Image
                  <input
                    type="file"
                    id="banner-replace"
                    accept="image/*"
                    onChange={handleReplaceBanner}
                    style={{ display: "none" }}
                  />
                </label>
                <button className="remove-btn" onClick={handleRemoveBanner}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="banner-upload-container">
            <label htmlFor="banner-upload" className="banner-upload-label">
              <MdDownloadForOffline className="banner-upload-icon" />
              <input
                type="file"
                id="banner-upload"
                accept="image/*"
                onChange={handleBannerUpload}
                style={{ display: "none" }}
              />
              <br />
              <span className="add-banner">Add Banner Image</span>
              <br />
              <span className="image-size-text">
                Optimal dimensions 3200 x 410px
              </span>
            </label>
          </div>
        )}
      </div>

      <div className="profile-container">
        <div className="profile-left">
          <div className="user-profile-info">
            <div className="user-info">
              <div className="profile-image-container">
                <img
                  src={profile.profilePicture || defaultUserImage}
                  alt="Profile"
                  className="profile-image"
                />
              </div>
              <div className="profile-info">
                <h1 className="profile-name">
                  {profile.basicInformation?.firstName || user.firstName}{" "}
                  {profile.basicInformation?.lastName || user.lastName}
                </h1>
                <p className="profile-location">
                  <MdLocationPin />
                  {profile.basicInformation?.country || ""}{" "}
                  {profile.basicInformation?.city || ""}
                </p>
                <div className="company-name">
                  <h6> Company Name</h6>
                  <span>{profile.basicInformation?.companyName || ""}</span>
                </div>
              </div>
            </div>
            <div className="edit-profile-container">
              <Link to="/edit-hire-designer-profile" className="edit-profile-btn">
                <MdEdit />
                Edit Your Profile
              </Link>
            </div>
            <div className="hire-designer-info-container">
              <div className="dg-info-sub-container">
                <div className="dg-info">
                  <h6 className="welcome-dg">
                    Hire{" "}
                    <span>
                      {profile.basicInformation?.firstName || user.firstName}{" "}
                      {profile.basicInformation?.lastName || user.lastName}
                    </span>
                  </h6>
                  <h4 className="dg-title"> Looking For Opportunities?</h4>
                  <span className="dg-description">
                    Add our new 'Hire' section to your profile to let visitors
                    know that you're looking for new opportunities.
                  </span>
                </div>
              </div>
              <div className="designer-social-link-container">
                <div className="designer-social-info">
                  <div className="social-list">
                    <div className="social-icon">
                      <FaFacebook />
                    </div>
                    <span>{profile.onTheWeb?.facebookUsername || ""}</span>
                  </div>
                  <div className="social-list">
                    <div className="social-icon">
                      <FaLinkedinIn />
                    </div>
                    <span>{profile.onTheWeb?.linkedinUsername || ""}</span>
                  </div>
                  <div className="social-list">
                    <div className="social-icon">
                      <FaGithub />
                    </div>
                    <span> {profile.onTheWeb?.githubUsername || ""}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="current-date">CURRENT DATE: {getCurrentDate()}</p>
        </div>
        <div className="right-side-container">
          <ul className="navbar-profile-data">
            <li className="profile-work">
              <Link
                to="#"
                className={activeLink === "status" ? "active" : ""}
                onClick={() => setActiveLink("status")}
              >
                Status
              </Link>
            </li>
          </ul>
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default HireDesignerProfile;
