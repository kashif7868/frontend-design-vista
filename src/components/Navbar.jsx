import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaBell,
  FaEnvelope,
  FaSignOutAlt,
  FaUser,
  FaCog,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import { IoMdHelp } from 'react-icons/io';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import '../assets/css/navbar.css';
import dvLogo from '../assets/images/logo.png';
import defaultUserPicture from '../assets/images/default-user.png';
import { useAuth } from '../context/authContext';
import CompanyUpdateModal from './componyUpdate/CompanyUpdateModal';
import ClientModel from './Client/ClientModel';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getDesignerById } from '../app/features/designerSlice';
import { getHireDesignerById } from '../app/features/hireDesignerSlice';
import { useUserRole } from '../context/UserRoleContext';

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [companyUpdate, setCompanyUpdate] = useState(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const userMenuRef = useRef(null);
  const messageMenuRef = useRef(null);
  const notificationMenuRef = useRef(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const designerProfile = useSelector((state) => state.designer?.profile);
  const hireDesignerProfile = useSelector((state) => state.hireDesigner?.profile);
  const { userRole } = useUserRole();

  useEffect(() => {
    if (user) {
      if (user.role === 'designer') {
        dispatch(getDesignerById(user.id));
      } else {
        dispatch(getHireDesignerById(user.id));
      }
    }
  }, [user, dispatch]);

  useEffect(() => {
    fetchNotifications();
    fetchMessages();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        openMenu === 'user'
      ) {
        setOpenMenu(null);
      } else if (
        messageMenuRef.current &&
        !messageMenuRef.current.contains(event.target) &&
        openMenu === 'message'
      ) {
        setOpenMenu(null);
      } else if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(event.target) &&
        openMenu === 'notification'
      ) {
        setOpenMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenu]);

  const getCurrentDateTime = () => {
    const now = new Date();
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
    };
    return now.toLocaleString('en-US', options);
  };

  const toggleMenu = (menu) => {
    if (menu === 'notification' && openMenu !== 'notification') {
      fetchNotifications();
    }
    if (menu === 'message' && openMenu !== 'message') {
      setUnreadMessagesCount(0); // Mark all messages as read when the menu is opened
    }
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleLogout = async () => {
    try {
      await logout();
      Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have successfully logged out!',
      });
      navigate('/login_signup');
    } catch (error) {
      console.error('Logout failed', error);
      Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: error.message || 'An error occurred while logging out.',
      });
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/updates/');
      if (response.status === 200) {
        setNotifications(response.data);
        setUnreadNotificationsCount(
          response.data.length > 0 ? response.data.length : 1
        );
      } else {
        throw new Error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/message/`);
      if (response.status === 200) {
        setMessages(response.data);
        setUnreadMessagesCount(response.data.length);
      } else {
        throw new Error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleCompanyUpdateClick = (update) => {
    const companyDetails = {
      logo: dvLogo,
      image: update.image,
      title: update.title,
      message: update.message,
      dateTime: getCurrentDateTime(),
    };
    setCompanyUpdate(companyDetails);
    setUnreadNotificationsCount(0);
  };

  const handleClientClick = (messageId) => {
    const selectedMessage = messages.find((msg) => msg.id === messageId);
    setSelectedMessage(selectedMessage);
    setShowClientModal(true);
  };

  const handleCloseModal = () => {
    setCompanyUpdate(null);
  };

  const handleCloseClientModal = () => {
    setShowClientModal(false);
  };

  const profileData =
    user?.role === 'designer' ? designerProfile : hireDesignerProfile;
  const userProfilePicture = profileData?.profilePicture || defaultUserPicture;

  return (
    <header className='header-container'>
      <div className='container-left'>
        <Link to='/'>
          <img src={dvLogo} alt='Logo' className='logo' />
        </Link>
        <Link to='/hiredesigner' className='link-freelancer'>
          Hire Designer
        </Link>
      </div>
      <div className='right-container'>
        <nav className='navbar'>
          <button
            className='hamburger-icon'
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
          <ul className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
            <li className='nav-list'>
              <button
                aria-label='Notification'
                onClick={() => toggleMenu('notification')}
                className={`notification-icon ${
                  openMenu === 'notification' ? 'active' : ''
                }`}
              >
                <FaBell />
                {unreadNotificationsCount > 0 && (
                  <span className='notification-counter'>
                    {unreadNotificationsCount}
                  </span>
                )}
                {openMenu === 'notification' && (
                  <div
                    className='notification-container'
                    ref={notificationMenuRef}
                  >
                    <div className='nt-header-text'>
                      <h4>Design Vista Feature updates</h4>
                    </div>
                    {notifications.length > 0 ? (
                      notifications.map((update) => (
                        <div
                          key={update.id}
                          className='company-notification'
                          onClick={() => handleCompanyUpdateClick(update)}
                        >
                          <div className='company-main-container'>
                            <div className='company-logo'>
                              <img src={dvLogo} alt='Design Vista' />
                            </div>
                            <div className='company-content'>
                              <span>{update.title}</span>
                              <div className='dv-feature-update-container'>
                                <img src={update.image} alt='Update' />
                                <p className='feature-details'>
                                  {update.message}
                                </p>
                              </div>
                              <span className='update-date-time'>
                                {getCurrentDateTime()}
                              </span>
                              <i className='nt-bottom-border'></i>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className='no-notifications'>
                        <p>No company updates</p>
                      </div>
                    )}
                  </div>
                )}
              </button>
            </li>
            {userRole === 'designer' && (
              <li className='nav-list'>
                <button
                  aria-label='Message'
                  onClick={() => toggleMenu('message')}
                  className={`message-main-container ${
                    openMenu === 'message' ? 'active' : ''
                  }`}
                >
                  <FaEnvelope />
                  {unreadMessagesCount > 0 && (
                    <span className='notification-counter'>
                      {unreadMessagesCount}
                    </span>
                  )}
                  {openMenu === 'message' && (
                    <div className='message-container' ref={messageMenuRef}>
                      <ul className='msg-dropdown-menu'>
                        <div className='message-top'>
                          <h4>Your Messages</h4>
                        </div>
                        {messages.length > 0 ? (
                          messages.map((message) => (
                            <div
                              key={message.id}
                              className='client-main-container'
                              onClick={() => handleClientClick(message.id)}
                            >
                              <div className='client-image'>
                                <img src={defaultUserPicture} alt='Client' />
                              </div>
                              <div className='msg-content'>
                                <h4>{message.companyName}</h4>
                                <p>{message.note}</p>
                                <span>
                                  {new Date(
                                    message.interviewDate
                                  ).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className='no-messages'>
                            <p>No messages</p>
                          </div>
                        )}
                      </ul>
                    </div>
                  )}
                </button>
              </li>
            )}
            {user ? (
              <>
                <li className='nav-list'>
                  <motion.div
                    className={`user-image ${
                      openMenu === 'user' ? 'active' : 'inactive'
                    }`}
                    onClick={() => toggleMenu('user')}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <button className='user-image-btn'>
                      <img
                        src={userProfilePicture}
                        alt='Profile'
                        className='profile-image'
                      />
                    </button>
                  </motion.div>
                  {openMenu === 'user' && (
                    <div className='user-menu-container' ref={userMenuRef}>
                      <div className='user-data'>
                        <div className='user-image'>
                          <img src={userProfilePicture} alt={user?.firstName} />
                          <div className='user-info'>
                            <h3>
                              {user?.firstName} {user?.lastName}
                            </h3>
                            <span>{user?.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className='user-link-ps'>
                        {userRole === 'designer' ? (
                          <li>
                            <Link to='/designer-profile'>
                              <FaUser className='user-icon' />
                              Designer Profile
                            </Link>
                          </li>
                        ) : (
                          <li>
                            <Link to='/hire-designer-profile'>
                              <FaUser className='user-icon' />
                              Hire Designer Profile
                            </Link>
                          </li>
                        )}
                        <li>
                          <Link to='/setting'>
                            <FaCog className='user-icon' />
                            Settings
                          </Link>
                        </li>
                      </div>
                      <div className='user-help-link'>
                        <li>
                          <Link to='/help'>
                            <IoMdHelp className='user-icon' />
                            Help
                          </Link>
                        </li>
                      </div>
                      <div className='logout-user'>
                        <li>
                          <Link
                            to='/login_signup'
                            onClick={handleLogout}
                            className='logout-btn'
                          >
                            <FaSignOutAlt className='user-icon' />
                            Logout
                          </Link>
                        </li>
                      </div>
                    </div>
                  )}
                </li>
              </>
            ) : (
              <li>
                <Link to='/login_signup' className='sign-btn'>
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <CompanyUpdateModal
        isOpen={companyUpdate !== null}
        handleClose={handleCloseModal}
        companyDetails={companyUpdate}
      />
      {user && showClientModal && selectedMessage && (
        <ClientModel
          isOpen={showClientModal}
          onClose={handleCloseClientModal}
          name={selectedMessage.companyName}
          image={userProfilePicture}
          message={selectedMessage.note}
          dateTime={new Date(selectedMessage.interviewDate).toLocaleString()}
        />
      )}
    </header>
  );
};

export default Navbar;
