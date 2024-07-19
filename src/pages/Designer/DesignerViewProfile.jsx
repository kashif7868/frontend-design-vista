import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "../../assets/css/pagesCss/designerViewProfile.css";
import defaultUserImage from "../../assets/images/default-user.png";
import coverImage from "../../assets/images/home-banner.webp";
import countryCodes from "../../data/countriesCode.json";
import { FaMapMarkerAlt, FaLinkedin, FaGithub, FaFacebook } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";

const baseURL = "http://localhost:3000/uploads/";

const DesignerViewProfile = () => {
  const { id } = useParams();
  const [designer, setDesigner] = useState(null);
  const [selectedDesigner, setSelectedDesigner] = useState(null);
  const [formData, setFormData] = useState({
    location: "",
    companyName: "",
    phoneCountryCode: countryCodes[0].code,
    phoneNumber: "",
    country: "", 
    interviewDate: "",
    note: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchDesignerData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/designers/${id}`
        );
        setDesigner(response.data);
      } catch (error) {
        console.error("Error fetching designer data: ", error);
      }
    };

    fetchDesignerData();
  }, [id]);

  const handleHireButtonClick = (designer) => {
    setSelectedDesigner(designer);
  };

  const handlePopupClose = () => {
    setSelectedDesigner(null);
    setFormData({
      location: "",
      companyName: "",
      phoneCountryCode: countryCodes[0].code,
      phoneNumber: "",
      country: "",
      interviewDate: "",
      note: "",
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName) newErrors.companyName = "Company Name is required";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone Number is required";
    if (!formData.country) newErrors.country = "Country is required"; 
    if (!formData.interviewDate) newErrors.interviewDate = "Interview Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendMessage = async () => {
    if (!selectedDesigner) {
      toast.error("No designer selected");
      return;
    }

    if (validateForm()) {
      try {
        await axios.post("http://localhost:3000/api/message/", {
          ...formData,
          designer: selectedDesigner._id,
          hireDesigner: selectedDesigner.user._id,
        });
        toast.success("Message sent successfully");
        handlePopupClose();
      } catch (error) {
        console.error("Error sending message: ", error);
        toast.error("Failed to send message");
      }
    }
  };

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
            user.profilePicture
              ? `${baseURL}${user.profilePicture}`
              : defaultUserImage
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
                  to={{
                    pathname: `https://www.linkedin.com/in/${user.linkedinUsername}`,
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin />
                </Link>
              )}
              {user.facebookUsername && (
                <Link
                  to={{
                    pathname: `https://www.facebook.com/${user.facebookUsername}`,
                  }}
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
            onClick={() => handleHireButtonClick(designer)}
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

      {selectedDesigner && (
        <div className="hire-popup">
          <div className="popup-content">
            <button className="close-button" onClick={handlePopupClose}>
              <AiOutlineClose />
            </button>
            <div className="popup-info">
              <img
                src={
                  selectedDesigner.user.profilePicture
                    ? `${baseURL}${selectedDesigner.user.profilePicture}`
                    : defaultUserImage
                }
                alt={
                  selectedDesigner.user.firstName
                    ? selectedDesigner.user.firstName
                    : "Designer"
                }
              />
              <h3>{`${selectedDesigner.user.firstName || ""} ${selectedDesigner.user.lastName || ""}`}</h3>
              <div className="form-group">
                <input
                  type="text"
                  name="companyName"
                  placeholder=""
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className={errors.companyName ? "error" : ""}
                />
                <label htmlFor="companyName" className="input-u-label">
                  Company Name
                </label>
              </div>
              {errors.companyName && (
                <span className="error-message">{errors.companyName}</span>
              )}
              <div className="form-group-cont">
                <div className="form-group">
                  <select
                    name="phoneCountryCode"
                    value={formData.phoneCountryCode}
                    onChange={handleInputChange}
                    className="input-u-country"
                  >
                    {countryCodes.map((code) => (
                      <option key={code.code} value={code.code}>
                        {code.country} ({code.code})
                      </option>
                    ))}
                  </select>
                  <label
                    htmlFor="phoneCountryCode"
                    className="input-u-label"
                  ></label>
                </div>
                <div className="from-group">
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder=""
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={errors.phoneNumber ? "error" : ""}
                  />
                  <label htmlFor="phoneNumber" className="input-u-label">
                    Phone Number
                  </label>
                  {errors.phoneNumber && (
                    <span className="error-message">{errors.phoneNumber}</span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="country"
                  placeholder=""
                  value={formData.country}
                  onChange={handleInputChange}
                  className={errors.country ? "error" : ""}
                />
                <label htmlFor="country" className="input-u-label">
                  Country
                </label>
                {errors.country && (
                  <span className="error-message">{errors.country}</span>
                )}
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="location"
                  placeholder=""
                  value={formData.location}
                  onChange={handleInputChange}
                  className=""
                />
                <label htmlFor="location" className="input-u-label">
                  Location
                </label>
              </div>
              <div className="form-group">
                <input
                  type="date"
                  name="interviewDate"
                  placeholder=""
                  value={formData.interviewDate}
                  onChange={handleInputChange}
                  className={errors.interviewDate ? "error" : ""}
                />
                {errors.interviewDate && (
                  <span className="error-message">{errors.interviewDate}</span>
                )}
                <label htmlFor="interviewDate" className="input-u-label">
                  Interview Date
                </label>
              </div>
              <div className="form-group">
                <textarea
                  name="note"
                  placeholder=""
                  value={formData.note}
                  onChange={handleInputChange}
                  className="input-u-note"
                ></textarea>
                {errors.note && (
                  <span className="error-message">{errors.note}</span>
                )}
                <label htmlFor="note" className="input-u-label-note">
                  Note
                </label>
              </div>
              <button className="send-message" onClick={handleSendMessage}>
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignerViewProfile;
