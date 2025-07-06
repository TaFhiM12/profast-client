import React from "react";
import ProfastLogo from "../Pages/Shared/ProfastLogo";
import authImage from "../assets/authImage.png";
import { Link, Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="w-11/12 mx-auto">
      <div className="flex flex-col-reverse md:flex-row min-h-[100vh]">
        <div className="flex-1">
          <div className="mt-16">
            <Link to='/'>
            <ProfastLogo /></Link>
          </div>
          <main className="">
            <Outlet />
          </main>
        </div>
        <div className="flex-1 bg-[#FAFDF0] flex justify-center items-center">
          <img src={authImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
