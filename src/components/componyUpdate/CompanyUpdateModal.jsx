import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/css/componyUpdates.css";
import dvLogo from "../../assets/images/logo.png";

const CompanyUpdateModal = ({ isOpen, handleClose, companyDetails }) => {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/updates/");
        if (response.status === 200) {
          setUpdates(response.data);
        } else {
          throw new Error("Failed to fetch updates");
        }
      } catch (error) {
        console.error("Error fetching updates:", error);
      }
    };

    if (isOpen) {
      fetchUpdates();
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="company-logo">
                <img src={dvLogo} alt="Company Logo" />
              </div>
              <button onClick={handleClose}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="all-updates-container">
                {updates.map((update) => (
                  <div key={update.id} className="company-update">
                    <div className="update-details">
                      <h4>{update.title}</h4>
                      <div className="update-image">
                        <img src={update.image} alt="Company Update" />
                      </div>
                      <p>{update.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyUpdateModal;
