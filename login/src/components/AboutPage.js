import React from "react";
import { useNavigate } from "react-router-dom";
import "./AboutPage.css";

function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      <div className="about-content">
        <h1>Reconnect with the spirit of travel</h1>


        <p>
          Discover hidden gems, embrace new cultures,
          and create memories that last a lifetime.
          Explore curated journeys, meet fellow travelers,
          and rediscover the joy of adventure.

        </p>
        {/* Navigate to /login when clicked */}
        <button className="about-button" onClick={() => navigate("/login")}>
          GET STARTED
        </button>
      </div>
    </div >
  );
}

export default AboutPage;
