import React from "react";
import { FaFacebook, FaLinkedinIn, FaInstagramSquare } from "react-icons/fa";
import dsLogo from "../assets/images/logo.png";
import { Link } from "react-router-dom";
import "../assets/css/footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="footer-sub-container">
        <div className="footer-end-line">
          <div className="container-rg-line">
            <div className="copyright">
              <img src={dsLogo} alt="Design Vista Logo" />
              <p> &copy; {new Date().getFullYear()} 5EUROS SAS</p>
              <p>
                <Link to="/design_vista">How Design Vista Works</Link>
              </p>
              <p>
                <Link to="/help">Help Center</Link>
              </p>
            </div>
            <div className="social-icons">
              <Link to="#">
                <FaFacebook />
              </Link>
              <Link to="#">
                <FaLinkedinIn />
              </Link>
              <Link to="#">
                <FaInstagramSquare />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
