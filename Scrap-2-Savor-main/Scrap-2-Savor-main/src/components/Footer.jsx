// src/components/Footer.jsx
import React from "react";
import "../assets/styles/Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: scrap2savor@example.com</p>
          <p>Phone: +91 9876543210</p>
          <p>Address: Hyderabad, India</p>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
      </div>
      <p className="footer-bottom">© 2025 Scrap to Savor. All rights reserved.</p>
    </footer>
  );
};

export default Footer;