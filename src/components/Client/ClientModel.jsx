import React, { useState, useEffect } from "react";
import "../../assets/css/clientModel.css"; // Import the CSS file
import { FaTimes } from "react-icons/fa"; // Import close icon from react-icons/fa
import Swal from "sweetalert2"; // Import SweetAlert library
import axios from "axios"; // Import Axios for API requests

const ClientModel = ({ isOpen, onClose, messageId }) => {
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Fetch the message from the API when the component mounts or messageId changes
  useEffect(() => {
    if (isOpen && messageId) {
      axios
        .get(`http://localhost:3000/api/message/${messageId}`)
        .then((response) => {
          setSelectedMessage(response.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the message!", error);
        });
    }
  }, [isOpen, messageId]);

  // Function to handle accepting the message
  const handleAccept = () => {
    Swal.fire({
      icon: "success",
      title: "Message Accepted",
      text: "You have accepted the message successfully!",
    });
  };

  // Function to handle canceling the message
  const handleCancel = () => {
    Swal.fire({
      icon: "info",
      title: "Message Cancelled",
      text: "You have cancelled viewing the message.",
    });
    onClose();
  };

  // Conditionally render the modal overlay if isOpen is true
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="client-modal-container">
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        {selectedMessage && (
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
        )}
      </div>
    </div>
  );
};

export default ClientModel;
