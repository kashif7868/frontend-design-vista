import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { IoMdSearch } from "react-icons/io";
import ScrollTrigger from "react-scroll-trigger";
import { Typewriter } from "react-simple-typewriter";
import "../assets/css/pagesCss/home.css";
import axios from "axios";
import { Link } from "react-router-dom";
import defaultUserImage from "../assets/images/default-user.png";
import Modal from "react-modal";
import { toast } from "react-toastify";
import countryCodes from "../data/countriesCode.json";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineClose } from "react-icons/ai";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersData, setUsersData] = useState([]);
  const [selectedDesigner, setSelectedDesigner] = useState(null);
  const [showHirePopup, setShowHirePopup] = useState(false);
  const [errors, setErrors] = useState({});
  // const baseURL = "http://localhost:3000/uploads/";
  const usersPerPage = 25;

  const [formData, setFormData] = useState({
    companyName: "",
    phoneCountryCode: "",
    phoneNumber: "",
    location: "",
    interviewDate: "",
    note: "",
  });

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/work/");
        const formattedData = response.data.map((work) => ({
          id: work.id,
          title: work.title,
          image: work.image,
          designer: work.designer || {}, // Ensure designer object exists
        }));
        setUsersData(formattedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchUsersData();
  }, []);

  const filteredUsers = usersData.filter((user) =>
    user.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loadMoreUsers = () => {
    setCurrentPage(currentPage + 1);
  };

  const displayedUsers = filteredUsers.slice(0, currentPage * usersPerPage);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
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
    if (!formData.companyName)
      newErrors.companyName = "Company Name is required";
    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Phone Number is required";
    if (!formData.interviewDate)
      newErrors.interviewDate = "Interview Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openPopup = async (designer) => {
    setSelectedDesigner(designer);
    if (designer && designer.id) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/work/${designer.id}`
        );
        const formattedWorks = response.data.map((work) => ({
          id: work.id,
          title: work.title,
          image: work.image,
          designer: work.designer || {},
        }));
        setSelectedDesigner((prev) => ({
          ...prev,
          works: formattedWorks,
        }));
      } catch (error) {
        console.error("Error fetching works by designer ID: ", error);
      }
    }
  };

  const handleSendMessage = async () => {
    if (validateForm()) {
      const data = {
        companyName: formData.companyName,
        country: formData.phoneCountryCode,
        phoneNumber: formData.phoneNumber,
        location: formData.location,
        interviewDate: formData.interviewDate,
        note: formData.note,
        designer: selectedDesigner._id,
        hireDesigner: selectedDesigner._id,
      };

      try {
        await axios.post("http://localhost:3000/api/message/", data);
        toast.success("Message sent successfully");
        setSelectedDesigner(null);
        setShowHirePopup(false);
      } catch (error) {
        toast.error("Error sending message");
        console.error("Error sending message:", error);
      }
    }
  };

  const closePopup = () => {
    setSelectedDesigner(null);
    setShowHirePopup(false);
  };

  return (
    <>
      <div className="banner-container-home">
        <div className="banner">
          <ScrollTrigger>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="banner-content"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Typewriter
                  words={["Design Vista"]}
                  loop={1}
                  cursor
                  cursorStyle="_"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1000}
                />
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <Typewriter
                  words={[
                    "Your Ultimate Destination For Fashion Designer Hire",
                  ]}
                  loop={1}
                  cursor
                  cursorStyle="_"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1000}
                />
              </motion.p>
            </motion.div>
          </ScrollTrigger>
        </div>
      </div>
      <div className="designer-work-main-container">
        <div className="designer-top-sub-navbar">
          <div className="ds-navbar">
            <ul>
              <li className="active">
                <FaHeart />
                <span>For You</span>
              </li>
              <li>
                <div className="search-bar-home-container">
                  <form className="search-bar-form" onSubmit={handleSearch}>
                    <button className="search-btn" type="submit">
                      <IoMdSearch />
                    </button>
                    <input
                      className="input"
                      placeholder="Search..."
                      required
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="designer-work-sub-container">
          {displayedUsers.length > 0 ? (
            displayedUsers.map((user) => {
              const designer = user.designer || {};
              const profilePicture =
                designer.profilePicture || defaultUserImage;
              const firstName = designer.firstName || "";
              const lastName = designer.lastName || "";

              return (
                <div
                  key={user.id}
                  className="ds-work-card"
                  onClick={() => openPopup(designer)}
                >
                  <div className="ds-work-image">
                    <Link to="#">
                      <img src={user.image} alt={user.title} />
                    </Link>
                    <div className="title-con">
                      <Link to="#">
                        <span className="title">{user.title}</span>
                      </Link>
                    </div>
                  </div>
                  <div className="ds-user-content">
                    <div className="user-image">
                      <Link to="#">
                        <img
                          src={profilePicture}
                          alt={`${firstName} ${lastName}`}
                        />
                      </Link>
                    </div>
                    <Link to="#" className="user-name">
                      {`${firstName} ${lastName}`}
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-designers-found">
              <div className="no-found">
                <span>No designers found.</span>
              </div>
            </div>
          )}
        </div>
        {displayedUsers.length > 0 &&
          displayedUsers.length < filteredUsers.length && (
            <div className="load-more-container">
              <button className="load-more-button" onClick={loadMoreUsers}>
                More Designers
              </button>
            </div>
          )}
      </div>
      {selectedDesigner && (
        <Modal
          isOpen={!!selectedDesigner}
          onRequestClose={closePopup}
          contentLabel="Designer Details"
          className="designer-popup-modal"
          overlayClassName="designer-popup-overlay"
        >
          <div className="designer-popup-content">
            <button className="close-button" onClick={closePopup}>
              <AiOutlineClose />
            </button>
            <div className="designer-popup-header">
              <img
                src={selectedDesigner.profilePicture || defaultUserImage}
                alt={`${selectedDesigner.firstName} ${selectedDesigner.lastName}`}
              />
              <h2>{`${selectedDesigner.firstName} ${selectedDesigner.lastName}`}</h2>
              <p>{selectedDesigner.country}</p>
            </div>
            <div className="designer-popup-body">
              <h3>Works:</h3>
              {selectedDesigner.works && selectedDesigner.works.length > 0 ? (
                selectedDesigner.works.map((work, index) => (
                  <div key={index} className="designer-work">
                    <img src={work.image} alt={work.title} />
                    <p>{work.title}</p>
                  </div>
                ))
              ) : (
                <p>No works available</p>
              )}
            </div>
            <div className="hire-designer-button-container">
              <button
                className="hire-designer-button"
                onClick={() => setShowHirePopup(true)}
              >
                Hire Designer
              </button>
            </div>
          </div>
        </Modal>
      )}
      {showHirePopup && selectedDesigner && (
        <Modal
          isOpen={showHirePopup}
          onRequestClose={closePopup}
          contentLabel="Hire Designer Modal"
          className="designer-hire-model-popup"
          overlayClassName="hire-designer-modal-overlay"
        >
          <button className="modal-close-button" onClick={closePopup}>
            <AiOutlineClose />
          </button>
          <div className="modal-content">
            <h3>
              Hire{" "}
              {`${selectedDesigner.firstName} ${selectedDesigner.lastName}`}
            </h3>
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
        </Modal>
      )}
    </>
  );
};

export default Home;
