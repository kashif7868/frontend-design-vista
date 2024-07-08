import React, { useState } from "react";
import "../../assets/css/pagesCss/helpCenter.css";
import { motion } from "framer-motion";
import ScrollTrigger from "react-scroll-trigger";
import { Typewriter } from "react-simple-typewriter";
import faqData from "../../assets/js/faqData";

const HelpCenter = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeSection, setActiveSection] = useState("getting-started");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      console.log(formData);
      setFormData({
        name: "",
        email: "",
        message: "",
      });
      setFormSubmitted(true);
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
    document.getElementById(section).scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="banner-container-help">
        <div className="banner-help">
          <ScrollTrigger>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="banner-content-help"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Typewriter
                  words={["Design Vista Help Center"]}
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
                  words={["Everything you need to get started on Design Vista"]}
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
      <div className="help-main-container">
        <div className="help-sidebar">
          <h2>Categories</h2>
          <ul>
            {[
              "getting-started",
              "account-management",
              "using-the-platform",
              "troubleshooting",
              "faq",
              "contact-form",
            ].map((section) => (
              <li key={section}>
                <span
                  className={activeSection === section ? "active" : ""}
                  onClick={() => handleSectionClick(section)}
                >
                  {section
                    .replace("-", " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="help-content">
          <section id="getting-started">
            <h2>Getting Started</h2>
            <p>
              Welcome to Design Vista! Here are some steps to get you started...
            </p>
          </section>
          <section id="account-management">
            <h2>Account Management</h2>
            <p>
              Manage your account settings, update your profile, and more...
            </p>
          </section>
          <section id="using-the-platform">
            <h2>Using the Platform</h2>
            <p>
              Learn how to use Design Vista's features to their full
              potential...
            </p>
          </section>
          <section id="troubleshooting">
            <h2>Troubleshooting</h2>
            <p>Having issues? Here are some common solutions...</p>
          </section>
          <section id="faq">
            <h2>Frequently Asked Questions</h2>
            {faqData.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </section>

          <section id="contact-form">
            <h2>Contact Us</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder=""
                  className="input-u-name"
                  required
                />
                <label htmlFor="name" className="input-u-label">
                  Name
                </label>
              </div>
              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=""
                  className="input-u-email"
                  required
                />
                <label htmlFor="email" className="input-u-label">
                  Email
                </label>
              </div>
              <div className="form-group">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder=""
                  className="input-u-message"
                  required
                ></textarea>
                <label htmlFor="message" className="input-u-label">
                  Message
                </label>
              </div>
              <button type="submit" className="submit-btn">
                Submit
              </button>
            </form>
            {formSubmitted && (
              <p className="success-message">Thank you for your message!</p>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default HelpCenter;
