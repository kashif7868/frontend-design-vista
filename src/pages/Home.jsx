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

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersData, setUsersData] = useState([]);
  const usersPerPage = 25;

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/work/");
        const formattedData = response.data.map((work) => ({
          id: work.id,
          title: work.title,
          image: work.image,
          designer: work.designer || {},
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
                {" "}
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
                {" "}
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
                <div key={user.id} className="ds-work-card">
                  <div className="ds-work-image">
                    <Link to={`/designer-profile/${designer.id}`}>
                      <img src={user.image} alt={user.title} />
                    </Link>
                    <div className="title-con">
                      <Link to={`/designer-profile/${designer.id}`}>
                        <span className="title">{user.title}</span>
                      </Link>
                    </div>
                  </div>
                  <div className="ds-user-content">
                    <div className="user-image">
                      <Link to={`/designer-profile/${designer.id}`}>
                        <img
                          src={profilePicture}
                          alt={`${firstName} ${lastName}`}
                        />
                      </Link>
                    </div>
                    <Link
                      to={`/designer-profile/${designer.id}`}
                      className="user-name"
                    >
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
    </>
  );
};

export default Home;
