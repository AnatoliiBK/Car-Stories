import React from "react";
import { Link } from "react-router-dom";
import './LandingPage.css'; // Стилі для гарного вигляду

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="landing-content">
        {/* <h1>Welcome to Car Stories</h1>
        <p>Explore the best products and enjoy great services.</p> */}
        <div className="landing-buttons">
          <Link to="/cars" className="btn">Автомобілі світу</Link>
          {/* <Link to="/details" className="btn">View Details</Link> */}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
