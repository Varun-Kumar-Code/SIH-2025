import React from "react";
import { useNavigate } from "react-router-dom";
import "./AboutPage.css";

function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      <div className="about-content">
        <h1>Discover the Art of Craftsmanship</h1>
        <p>
          Our app connects you with authentic handmade creations and the artisans behind them. Explore curated collections, learn the stories of skilled makers, and reconnect with the beauty of timeless craft.
        </p>
        <button 
          className="about-button" 
          onClick={() => navigate("/login")}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default AboutPage;
