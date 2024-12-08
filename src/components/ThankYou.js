import React from "react";
import { Link } from "react-router-dom";
import "../styles/ThankYou.css";

const ThankYou = () => {
  return (
    <div className="thank-you">
      <h2>Thank You!</h2>
      <p>Your course preferences have been successfully submitted.</p>
      <Link to="/">Go Back to Home</Link>
    </div>
  );
};

export default ThankYou;
