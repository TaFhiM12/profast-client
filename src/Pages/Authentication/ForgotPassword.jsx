import React from "react";
import { Link } from "react-router";

const ForgotPassword = () => {
  return (
    <div>
      <div className="p-10">
        <div className="w-full md:w-[60%]">
          <div className="w-full">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Forgot Password
            </h1>
            <p className="text-lg text-gray-600 mb-4">Enter your email address and we’ll send you a reset link.</p>

            <form className="space-y-2">
              
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <input
                type="submit"
                className="w-full mt-4 btn btn-primary text-white font-medium py-3 px-4 rounded-lg transition duration-200"
                value="Continue"
              />
            </form>

            <p className="text-center text-gray-600 mt-6">
              Remeber your password?{" "}
              <Link
                to="/login"
                className="text-lime-600 hover:text-lime-800 font-medium"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
