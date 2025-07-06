import React from "react";

import logo from "../../assets/logo.png";
import { Link } from "react-router";

const ProfastLogo = () => {
  return (
    <div>
      <div className="flex">
        <img className="relative right-4 -top-5" src={logo} alt="" />
        <p className="text-3xl absolute font-extrabold text-logo">ProFast</p>
      </div>
    </div>
  );
};

export default ProfastLogo;
