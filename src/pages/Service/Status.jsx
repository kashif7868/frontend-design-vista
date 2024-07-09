import React from "react";
import "../../assets/css/pagesCss/statusPage.css";
import CountUp from "react-countup";
import { motion } from "framer-motion";

const Status = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="status-main-container">
      <h1>Hire Designer Status</h1>
      <motion.div
        className="status-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="status-item" variants={itemVariants}>
          <div className="status-item-content">
            <div className="status-value">
              <CountUp end={5} duration={2} />
            </div>
            <div className="status-label">Projects</div>
          </div>
        </motion.div>
        <motion.div className="status-item" variants={itemVariants}>
          <div className="status-item-content">
            <div className="status-value">
              <CountUp end={10} duration={2} />
            </div>
            <div className="status-label">Designers</div>
          </div>
        </motion.div>
        <motion.div className="status-item" variants={itemVariants}>
          <div className="status-item-content">
            <div className="status-value">
              <CountUp end={15} duration={2} />
            </div>
            <div className="status-label">Completed</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Status;
