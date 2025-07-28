import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/style.css";
import logo from "../assets/images/logo.png";
import image1 from "../assets/images/image1.jpg";
import image2 from "../assets/images/image2.jpg";
import image3 from "../assets/images/image3.jpg";
import image4 from "../assets/images/image4.jpg";

const Home = () => {
  const carouselContainerRef = useRef(null);
  const [index, setIndex] = useState(0);


  const images = [
    { src: image1, quote: "Many fight for food while others waste it." },
    { src: image2, quote: "A lot of food is wasted daily." },
    { src: image3, quote: "Volunteers and NGOs are here to help." },
    { src: image4, quote: "Not everyone gets food due to lack of donor information." },
  ];
  const totalSlides = images.length;


  useEffect(() => {
    const interval = setInterval(() => {
      moveCarousel((index + 1) % totalSlides);
    }, 3000);

    return () => clearInterval(interval);
  }, [index]); // Only run once

  const moveCarousel = (newIndex) => {
    if (!carouselContainerRef.current) return;

    carouselContainerRef.current.style.transition = "transform 0.8s ease-in-out";
    carouselContainerRef.current.style.transform = `translateX(-${newIndex * 100}vw)`;
    setIndex(newIndex);
  };

  const handleLeftClick = () => {
    const newIndex = (index - 1 + totalSlides) % totalSlides;
    moveCarousel(newIndex);
  };

  const handleRightClick = () => {
    const newIndex = (index + 1) % totalSlides;
    moveCarousel(newIndex);
  };
  

  return (
    <div>
      {/* Header */}
      <header>
        <nav className="navbar">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          <ul className="nav-links">
            {/* Dropdown Fix */}
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

      {/* Carousel */}
      <div className="carousel">
        <button className="left" onClick={handleLeftClick}>←</button>
        <div className="carousel-container" ref={carouselContainerRef}>
          {images.map((img, idx) => (
            <div key={idx} className="carousel-slide">
              <img src={img.src} alt={`Slide ${idx + 1}`} />
              <div className="carousel-quote">{img.quote}</div>
            </div>
          ))}
        </div>
        <button className="right" onClick={handleRightClick}>→</button>
      </div>

      {/* Donate Now Button */}
      <div className="donate-now-section">
        <h2>Ready to Make a Difference?</h2>
        <p>Donors, NGOs, and Volunteers — Join hands with us to save food and save lives.</p>
        <Link to="/register" className="donate-now-button">Donate Now</Link>
      </div>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-container">
          <h2>About Us</h2>
          <p>Every day, tons of food go to waste in restaurants, hotels, and households, while millions of people struggle to get a single meal. This imbalance is not due to a lack of food, but due to inefficiency in distribution. <strong>Scrap to Savor</strong> is here to change that.</p>
          
          <h3>🌍 Our Mission</h3>
          <p>We aim to create a sustainable system where surplus food is efficiently redirected to those who need it the most. By connecting food donors, NGOs, and volunteers on a single platform, we ensure that edible food never goes to waste.</p>
          
          <h3>⚡ The Problem We Solve</h3>
          <p>Food wastage is a major global issue. Restaurants and hotels discard leftover food due to lack of proper channels for redistribution. At the same time, countless people—especially those in underprivileged communities—face hunger on a daily basis.</p>
          
          <h3>🚀 How We Bridge the Gap</h3>
          <p>Our platform acts as a bridge between food donors and NGOs, making sure that excess food reaches those in need instead of ending up in the trash. Here’s how it works:</p>
          <ul>
            <li><strong>Donors:</strong> Register on the platform and list their surplus food.</li>
            <li><strong>NGOs:</strong> Receive notifications about available food and arrange collection.</li>
            <li><strong>Volunteers:</strong> Help in transporting and distributing food to the needy.</li>
          </ul>
  
          <h3>🔍 Why Choose Scrap to Savor?</h3>
          <ul>
            <li>Seamless platform for <strong>food donation</strong> and collection.</li>
            <li>AI-powered <strong>route optimization</strong> for efficient food transportation.</li>
            <li>Real-time <strong>tracking</strong> of food distribution efforts.</li>
            <li>Encouraging businesses and individuals to take part in <strong>social responsibility</strong>.</li>
          </ul>
  
          <h3>🌟 Our Vision</h3>
          <p>We envision a world where no food is wasted, and no person goes hungry. By leveraging technology, community support, and collaborative efforts, we strive to make food redistribution an effortless process.</p>
  
          <h3>💡 Get Involved</h3>
          <p>We invite restaurants, hotels, supermarkets, and individuals to join us in this fight against food wastage. Whether you wish to donate, volunteer, or partner with us, every effort counts in making a difference.</p>
  
          <p><strong>Be the change. Let’s work together to turn surplus into hope! 🌱</strong></p>
        </div>
      </section>

      {/* Footer */}
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
    </div>
  );
};

export default Home;