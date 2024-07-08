import React from "react";
import { motion } from "framer-motion";
import ScrollTrigger from "react-scroll-trigger";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import frontendImage from "../assets/images/team/kashif_ali.jpg";
import backendImage from "../assets/images/team/areeb.png";
import dcImage from "../assets/images/team/mamnoon.png";
import { Typewriter } from "react-simple-typewriter";
import "../assets/css/designVista.css";
import useScrollTrigger from "../hooks/useScrollTrigger";

const DesignVista = () => {
  const scrollDirection = useScrollTrigger();
  return (
    <>
      <section
        className={`design-vista-banner-container ${
          scrollDirection === "down" ? "scroll-down" : ""
        }`}
      >
        <div className="design-vista-banner">
          <ScrollTrigger>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="design-vista-banner-content"
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
                {" "}
                <Typewriter
                  words={["A platform where creativity meets collaboration."]}
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
      </section>
      <section className="how-it-works-container">
        <ScrollTrigger>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="how-it-works-content"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              How Design Vista Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              Design Vista is a state-of-the-art virtual meeting place that
              gives independent fashion designers and businesses the ability to
              interact, work together, and discover new avenues in the fashion
              industry. The platform combines the industry's need for unique
              design solutions with the artistic abilities of designers.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <h3>For Industry or Companies</h3>
              <p>
                Companies can post their fashion design needs and requirements
                on Design Vista. They have the option to search for designers
                based on their portfolios and expertise. Once they find a
                suitable designer, they can initiate an interview process
                directly through the platform and send messages during the
                interview period.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <h3>For Fashion Designers</h3>
              <p>
                Designers can create profiles showcasing their work, skills, and
                experience. They can apply for projects or be discovered by
                companies looking for fresh, unique design perspectives. After
                the interview process, designers collaborate with companies to
                bring their creative visions to life.
              </p>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              style={{ marginTop: "20px" }}
            >
              Note: Payment methods are not managed through Design Vista. All
              financial arrangements must be handled externally.
            </motion.p>
          </motion.div>
        </ScrollTrigger>
      </section>
      <section className="features-container">
        <ScrollTrigger>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="features-content"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Features
            </motion.h2>
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <li>Seamless designer-company interaction</li>
              <li>Extensive designer portfolios</li>
              <li>Project management tools</li>
              <li>Real-time collaboration and feedback</li>
              <li>Secure messaging during the interview process</li>
            </motion.ul>
          </motion.div>
        </ScrollTrigger>
      </section>

      <section className="team-container">
        <h2>Meet Our Team</h2>
        <p>
          Our team is dedicated to creating a platform that fosters
          collaboration and innovation in the fashion industry.
        </p>
        <Slider
          autoplay={true}
          autoplaySpeed={3000} // Adjust autoplay speed as needed
          dots={true} // Optional: Add navigation dots
          infinite={true} // Optional: Enable infinite loop
          speed={500} // Optional: Animation speed
          slidesToShow={1} // Show one slide at a time
          slidesToScroll={1} // Scroll one slide at a time
        >
          <div>
            <img src={frontendImage} alt="Frontend Developer" />
            <div>
              <h3>Frontend Developer</h3>
              <p>Kashif Ali</p>
            </div>
          </div>
          <div>
            <img src={backendImage} alt="Backend Developer" />
            <div>
              <h3>Backend Developer</h3>
              <p>Muhammad Areeb</p>
            </div>
          </div>

          <div>
            <img src={dcImage} alt="Documentation Creator" />
            <div>
              <h3>Documentation Creator</h3>
              <p>Mamnoon Muhammad</p>
            </div>
          </div>
        </Slider>
      </section>
      <section className="cta-container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="cta-content"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Join Design Vista Today!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            Whether you're a fashion designer looking to showcase your talents
            or a company seeking innovative design solutions, Design Vista is
            the perfect platform for you. Sign up now and start your creative
            journey with us!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="cta-button"
          >
            <Link
              to="/login_signUp"
              smooth={true}
              duration={500}
              offset={-50}
              className="cta-link"
            >
              Get Started
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
};

export default DesignVista;
