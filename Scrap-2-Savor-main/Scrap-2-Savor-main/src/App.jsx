// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles

import Home from "./pages/Home";
import NGOsPage from "./pages/NGOsPage";
import VolunteersPage from "./pages/VolunteersPage";
import DonorsPage from "./pages/DonorsPage"; 
import RegisterPage from './components/RegisterPage.jsx';
import LoginPage from "./components/LoginPage.jsx";

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,   // animation duration in ms
      once: true,       // whether animation should happen only once
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/ngos" element={<NGOsPage />} />
        <Route path="/volunteers" element={<VolunteersPage />} />
        <Route path="/donors" element={<DonorsPage />} />
      </Routes>
    </Router>
  );
};

export default App;