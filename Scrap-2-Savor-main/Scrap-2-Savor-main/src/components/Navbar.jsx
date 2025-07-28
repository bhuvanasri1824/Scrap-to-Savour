// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/Navbar.css";
import logo from "../assets/images/logo.png";

const Navbar = () => {
  return (
    <header>

    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Scrap to Savor Logo" />
      </div>
      <ul className="nav-links">
        <li className="nav-item dropdown">
          <Link to="/" className="dropdown-toggle">Home</Link>
          <ul className="dropdown-content">
            <li><a href="#about">About Us</a></li>
            <li><a href="#footer">Contact Us</a></li>
          </ul>
        </li>
        <li><Link to="/ngos">NGOs</Link></li>
        <li><Link to="/volunteers">Volunteers</Link></li>
        <li><Link to="/donors">Donors</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
    </header>
  );
};

export default Navbar;