import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../assets/css/clientModel.css";
import { FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ClientModel = ({ isOpen, onClose, messageId }) => {
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/message/${messageId}`);
        setSelectedMessage(response.data);
      } catch (error) {
        console.error("Error fetching message:", error);
      }
    };

    if (messageId) {
      fetchMessage();
    }
  }, [messageId]);

  const handleAccept = () => {
    toast.success("You have accepted the message successfully!");
  };

  const handleCancel = () => {
    toast.info("You have cancelled viewing the message.");
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="client-modal-container">
        <ToastContainer />
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        {selectedMessage ? (
          <>
            <div className="client-details">
              <h3>{selectedMessage.companyName}</h3>
              <p>{selectedMessage.note}</p>
              <p>Location: {selectedMessage.location}</p>
              <p>Phone: {selectedMessage.phoneNumber}</p>
              <span>Interview Date: {new Date(selectedMessage.interviewDate).toLocaleString()}</span>
            </div>
            <div className="button-container">
              <button className="accept-button" onClick={handleAccept}>
                Accept
              </button>
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ClientModel;
