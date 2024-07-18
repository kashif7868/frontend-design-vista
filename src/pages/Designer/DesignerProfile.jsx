import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MdLocationPin, MdEdit, MdDownloadForOffline } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import defaultUserImage from "../../assets/images/default-user.png";
import { FaFacebook, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { toast } from "react-toastify";
import WorkPage from "../Service/Work";
import "../../assets/css/pagesCss/profile.css";
import {
  createCoverImage,
  deleteCoverImage,
  updateCoverImage,
  clearBannerImage,
  fetchCoverImageById,
} from "../../app/features/coverBannerSlice";
import { getDesignerByIdByWork } from "../../app/features/designerSlice";

const DesignerProfile = ({ coverImageId }) => {
  const { id } = useParams();
  const [activeLink, setActiveLink] = useState("work");
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.designer.profile);
  const status = useSelector((state) => state.designer.status);
  const bannerImage = useSelector((state) => state.coverBanner.bannerImage);
  const coverBannerStatus = useSelector((state) => state.coverBanner.status);
  const currentCoverImageId = useSelector(
    (state) => state.coverBanner.coverImageId
  );

  useEffect(() => {
    const storedProfile = localStorage.getItem("designerProfile");
    if (!storedProfile && id) {
      dispatch(getDesignerByIdByWork(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (id) {
      if (coverImageId) {
        dispatch(fetchCoverImageById(coverImageId));
      } else {
        dispatch(clearBannerImage());
      }
    }
  }, [coverImageId, dispatch, id]);

  if (status === "loading" || coverBannerStatus === "loading") {
    return <div>Loading...</div>;
  }

  const handleBannerUpload = (event) => {
    const file = event.target.files[0];
    if (file && id) {
      dispatch(createCoverImage({ userId: id, imageFile: file }))
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
    if (currentCoverImageId && id) {
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
    if (file && id) {
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

  const renderPage = () => {
    switch (activeLink) {
      case "work":
        return <WorkPage />;
      default:
        return null;
    }
  };

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString();
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
                  {profile.basicInformation?.firstName || ""}{" "}
                  {profile.basicInformation?.lastName || ""}
                </h1>
                <p className="profile-location">
                  <MdLocationPin />
                  {profile.basicInformation?.country || ""}{" "}
                  {profile.basicInformation?.city || ""}
                </p>

                <span className="category-con">
                  {" "}
                  {profile.basicInformation?.categoryName || ""}
                </span>
              </div>
            </div>
            <div className="edit-profile-container">
              <Link
                to={`/edit-designer-profile/${id}`}
                className="edit-profile-btn"
              >
                <MdEdit />
                Edit Your Profile
              </Link>
            </div>
            <div className="dg-info-sub-container">
              <div className="dg-info">
                <h6 className="welcome-dg">
                  <span>Welcome to Your Design Haven!</span>
                </h6>
                <span className="dg-description">
                  Design Vista is your ultimate platform to start a creative
                  journey, where your design dreams take flight and innovation
                  thrives. Join a community that nurtures your talent and
                  propels your creativity to new heights.
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
          <p className="current-date">CURRENT DATE: {getCurrentDate()}</p>
        </div>

        <div className="right-side-container">
          <ul className="navbar-profile-data">
            <li className="profile-work">
              <Link
                to="#"
                className={activeLink === "work" ? "active" : ""}
                onClick={() => setActiveLink("work")}
              >
                Work
              </Link>
            </li>
          </ul>
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default DesignerProfile;
