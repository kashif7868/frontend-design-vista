import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "../../assets/css/pagesCss/designerViewProfile.css";
import defaultUserImage from "../../assets/images/default-user.png";
import coverImage from "../../assets/images/home-banner.webp";
import { FaMapMarkerAlt, FaLinkedin, FaGithub, FaFacebook } from "react-icons/fa";

const baseURL = "http://localhost:3000/uploads/";

const DesignerViewProfile = ({ handleHireClick }) => {
  const { id } = useParams();
  const [designer, setDesigner] = useState(null);

  useEffect(() => {
    const fetchDesignerData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/designers/${id}`);
        setDesigner(response.data);
      } catch (error) {
        console.error("Error fetching designer data: ", error);
      }
    };

    fetchDesignerData();
  }, [id]);

  if (!designer) {
    return <div>Loading...</div>;
  }

  const user = designer.user || {};

  return (
    <div className="designer-view-profile">
      <div className="designer-cover-banner-container">
        <img
          src={user.coverImage ? `${baseURL}${user.coverImage}` : coverImage}
          alt="Cover"
          className="cover-image"
        />
      </div>
      <div className="designer-p-picture">
        <img
          src={
            user.profilePicture ? `${baseURL}${user.profilePicture}` : defaultUserImage
          }
          alt="Profile"
          className="profile-image"
        />
      </div>
      <div className="designer-info-container">
        <div className="designer-info">
          <div className="designer-content-info">
            <h3 className="designer-by-name">{`${user.firstName || ""} ${user.lastName || ""}`}</h3>
            <span className="designer-by-location">
              <FaMapMarkerAlt /> {user.country || ""}
            </span>
            <p className="designer-bio">{user.description || ""}</p>
            <div className="designer-social-media">
              {user.linkedinUsername && (
                <Link
                  to={{ pathname: `https://www.linkedin.com/in/${user.linkedinUsername}` }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin />
                </Link>
              )}
              {user.facebookUsername && (
                <Link
                  to={{ pathname: `https://www.facebook.com/${user.facebookUsername}` }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook />
                </Link>
              )}
              {user.githubUsername && (
                <Link
                  to={{ pathname: `https://github.com/${user.githubUsername}` }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub />
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="designer-btn-container">
          <button
            className="designer-to-hire-btn"
            onClick={() => handleHireClick(designer)}
          >
            Hire {`${user.firstName}`}
          </button>
        </div>
      </div>
      <div className="designer-work-container">
        {designer.works &&
          designer.works.map((work, index) => (
            <div className="designer-works-container" key={index}>
              <div className="work-card-image">
                <img
                  src={`${baseURL}${work}`}
                  alt={`${user.firstName || "Designer"} work ${index + 1}`}
                />
              </div>
              <div className="work-title">
                <span className="title">{`Work ${index + 1}`}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DesignerViewProfile;
