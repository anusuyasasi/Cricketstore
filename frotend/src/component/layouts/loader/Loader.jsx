import React from "react";
import LoaderBlack from "../../../Image/Loader-svg/LoaderBlack.svg"; // Remove the curly braces
import "./Loader.css";

const CricketBallLoader = () => (
  <div className="cricket-ball-loader">
    {/* Use a standard img tag instead of a component */}
    <img src={LoaderBlack} className="spinner" alt="loading" />
  </div>
);

export default CricketBallLoader;