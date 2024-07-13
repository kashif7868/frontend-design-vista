import React from "react";
import "../../assets/css/pagesCss/designerViewProfile.css";
import defaultUserImage from "../../assets/images/default-user.png";
import coverImage from "../../assets/images/home-banner.webp";
import workImage1 from "../../assets/images/work/work1.png";
import workImage2 from "../../assets/images/work/work2.png";
import workImage3 from "../../assets/images/work/work3.png";
import workImage4 from "../../assets/images/work/work4.png";
import workImage5 from "../../assets/images/work/work5.png";
import {
  FaMapMarkerAlt,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

const DesignerViewProfile = ({ designer, baseURL, handleHireClick }) => {
  if (!designer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="designer-view-profile">
      <div className="designer-cover-banner-container">
        <img
          src={
            designer.coverPhoto
              ? `${baseURL}${designer.coverPhoto}`
              : coverImage
          }
          alt="Cover"
          className="cover-image"
        />
      </div>
      <div className="designer-p-picture">
        <img
          src={
            designer.profilePicture
              ? `${baseURL}${designer.profilePicture}`
              : defaultUserImage
          }
          alt="Profile"
          className="profile-image"
        />
      </div>
      <div className="designer-info-container">
        <div className="designer-info">
          <div className="designer-content-info">
            <h3 className="designer-by-name">{`${designer.basicInformation.firstName} ${designer.basicInformation.lastName}`}</h3>
            <span className="designer-by-location">
              <FaMapMarkerAlt /> {designer.basicInformation.country}
            </span>
            <p className="designer-bio">{designer.bio}</p>
            <div className="designer-social-media">
              {designer.socialMedia?.linkedin && (
                <a
                  href={designer.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin />
                </a>
              )}
              {designer.socialMedia?.twitter && (
                <a
                  href={designer.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter />
                </a>
              )}
              {designer.socialMedia?.instagram && (
                <a
                  href={designer.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="designer-buttons-container">
          <button
            className="designer-hire-btn"
            onClick={() => handleHireClick(designer)}
          >
            Hire {designer.basicInformation.firstName}
          </button>
        </div>
      </div>
      <div className="designer-work-container">
        {designer.works &&
          designer.works.map((work, index) => (
            <div className="designer-works-container" key={index}>
              <div className="work-card-image">
                <img
                  src={`${baseURL}${work.image}`}
                  alt={`${designer.basicInformation.firstName} work ${index + 1}`}
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

// Dummy Data for Testing
const designer = {
  coverPhoto: coverImage,
  profilePicture: defaultUserImage,
  basicInformation: {
    firstName: "Kashif",
    lastName: "Ali",
    country: "Lahore",
  },
  bio: "A highly creative and multitalented Graphic Designer with extensive experience in multimedia, marketing, and print design.",
  socialMedia: {
    linkedin: "https://www.linkedin.com/in/johndoe/",
    twitter: "https://twitter.com/johndoe",
    instagram: "https://www.instagram.com/johndoe/",
  },
  works: [
    { image: workImage1 },
    { image: workImage2 },
    { image: workImage3 },
    { image: workImage4 },
    { image: workImage5 },
  ],
};

// Use the component with dummy data
const App = () => (
  <DesignerViewProfile
    designer={designer}
    baseURL=""
    handleHireClick={(designer) =>
      alert(`Hire ${designer.basicInformation.firstName} clicked!`)
    }
  />
);

export default App;
