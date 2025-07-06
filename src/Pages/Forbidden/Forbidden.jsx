import React from 'react';
import { Link } from 'react-router';
import { FiLock } from 'react-icons/fi';

const Forbidden = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="text-lime-600 mb-6">
          <FiLock className="mx-auto text-6xl" />
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mb-2">403</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Access Forbidden</h2>
        <p className="text-gray-500 mb-6">
          You don’t have permission to access this page.
          Please contact the administrator if you believe this is a mistake.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2 text-white bg-lime-600 hover:bg-lime-700 rounded-lg transition duration-200"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;
