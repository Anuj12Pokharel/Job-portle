import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600">
          <Link to="/">JobPortal</Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/jobs" className="hover:text-blue-600">Jobs</Link>
          <Link to="/companies" className="hover:text-blue-600">Companies</Link>
          <Link to="/about" className="hover:text-blue-600">About</Link>
          <Link to="/contact" className="hover:text-blue-600">Contact</Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex space-x-4">
          <Link to="/signin" className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition duration-200">Sign In</Link>
          <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200">Register</Link>
        </div>

        {/* Mobile menu toggle placeholder */}
        <div className="md:hidden">
          {/* You can implement mobile menu toggle here if needed */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
