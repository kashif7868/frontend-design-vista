import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineClose,
} from "react-icons/ai";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/css/pagesCss/hireDesigner.css";
import countryCodes from "../../data/countriesCode.json";
import ScrollTrigger from "react-scroll-trigger";
import { Typewriter } from "react-simple-typewriter";
import defaultUserImage from "../../assets/images/default-user.png";

const HireDesigner = () => {
  const [designers, setDesigners] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [selectedDesigner, setSelectedDesigner] = useState(null);
  const [formData, setFormData] = useState({
    location: "",
    companyName: "",
    phoneCountryCode: countryCodes[0].code,
    phoneNumber: "",
    interviewDate: "",
    note: "",
  });
  const [errors, setErrors] = useState({});
  const controls = useAnimation();
  const designersPerPage = 10;
  const baseURL = "http://localhost:3000/uploads/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isVisible) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [isVisible, controls]);

  useEffect(() => {
    const fetchDesigners = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/designers/"
        );
        setDesigners(response.data);
      } catch (error) {
        console.error("Error fetching designers data:", error);
      }
    };

    fetchDesigners();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchActive(true);
    setCurrentPage(1);
  };

  const filteredDesigners = designers.filter(
    (designer) =>
      designer.basicInformation &&
      `${designer.basicInformation.firstName} ${designer.basicInformation.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDesigners.length / designersPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const startIndex = (currentPage - 1) * designersPerPage;
  const endIndex = startIndex + designersPerPage;

  const designersOnPage = filteredDesigners.slice(startIndex, endIndex);

  const handleHireClick = (designer) => {
    setSelectedDesigner(designer);
  };

  const handlePopupClose = () => {
    setSelectedDesigner(null);
    setFormData({
      location: "",
      companyName: "",
      phoneCountryCode: countryCodes[0].code,
      phoneNumber: "",
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
    if (!formData.companyName)
      newErrors.companyName = "Company Name is required";
    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Phone Number is required";
    if (!formData.interviewDate)
      newErrors.interviewDate = "Interview Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        handlePopupClose();
      } catch (error) {
        toast.error("Error sending message");
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="hire-designer-banner-container">
        <div className="hire-designer-banner">
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
                  words={["Hire Fashion Designers"]}
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
                    "Find the perfect fashion designer for your business",
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

      <div className="designer-main-container">
        <div className="designer-container">
          <div className="designer-top-container">
            <span>{filteredDesigners.length} Designers</span>
            <div className="search-bar-container">
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
          </div>

          <div className="designer-by-work-container">
            <div className="designer-by-work-container">
              <div className="designer-by-work-sub-container">
                {designersOnPage.length > 0 ? (
                  designersOnPage.map((designer) => (
                    <div className="designer-by-work-item" key={designer._id}>
                      <div className="designer-by-work-image">
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
                      <div className="designer-by-work-content-info">
                        <h3 className="designer-by-work-name">{`${designer.basicInformation.firstName} ${designer.basicInformation.lastName}`}</h3>
                        <span className="designer-by-work--location">
                          <FaMapMarkerAlt /> {designer.basicInformation.country}
                        </span>
                        <button
                          className="designer-hire-btn"
                          onClick={() => handleHireClick(designer)}
                        >
                          Hire {`${designer.basicInformation.firstName}`}
                        </button>
                      </div>
                      <div className="designer-right-side-item">
                        {designer.works.slice(0, 3).map((work, index) => (
                          <img
                            key={index}
                            src={`${baseURL}${work.image}`}
                            alt={`${designer.basicInformation.firstName} work ${
                              index + 1
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                ) : searchActive ? (
                  <div className="no-designers-found">
                    <div className="no-found">
                      <span>No designers found.</span>
                    </div>
                  </div>
                ) : (
                  <div className="no-designers-found">
                    <div className="no-designers">
                      <span>Loading designers...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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
                  selectedDesigner.profilePicture
                    ? `${baseURL}${selectedDesigner.profilePicture}`
                    : defaultUserImage
                }
                alt={selectedDesigner.basicInformation.firstName}
              />
              <h3>{`${selectedDesigner.basicInformation.firstName} ${selectedDesigner.basicInformation.lastName}`}</h3>
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
          </div>
        </div>
      )}

      <section className="pagination-container">
        <nav aria-label="Page navigation example" id="custom-page">
          <ul className="pagination flex justify-center">
            <li className="page-item">
              <button
                className="page-link"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <AiOutlineArrowLeft className="w-6 h-6" />
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <li key={pageNumber} className="page-item">
                  <button
                    className={`page-link ${
                      pageNumber === currentPage
                        ? "text-blue-900 font-bold"
                        : ""
                    }`}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                </li>
              )
            )}
            <li className="page-item">
              <button
                className="page-link"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <AiOutlineArrowRight className="w-6 h-6" />
              </button>
            </li>
          </ul>
        </nav>
      </section>
    </>
  );
};

export default HireDesigner;
