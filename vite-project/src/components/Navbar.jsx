import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Lucide icons (install via: npm i lucide-react)

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600">
          <Link to="/">JobPortal</Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/jobs" className="hover:text-blue-600">Jobs</Link>
          <Link to="/companies" className="hover:text-blue-600">Companies</Link>
          <Link to="/about" className="hover:text-blue-600">About</Link>
          <Link to="/contact" className="hover:text-blue-600">Contact</Link>
        </div>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex space-x-4">
          <Link
            to="/signin"
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition duration-200"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
          >
            Register
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-blue-600">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-white shadow-sm">
          <Link to="/" className="block text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/jobs" className="block text-gray-700 hover:text-blue-600">Jobs</Link>
          <Link to="/companies" className="block text-gray-700 hover:text-blue-600">Companies</Link>
          <Link to="/about" className="block text-gray-700 hover:text-blue-600">About</Link>
          <Link to="/contact" className="block text-gray-700 hover:text-blue-600">Contact</Link>
          <div className="pt-2 border-t border-gray-200">
            <Link
              to="/signin"
              className="block px-4 py-2 border border-blue-600 text-blue-600 rounded text-center hover:bg-blue-600 hover:text-white transition duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="block px-4 py-2 mt-2 bg-blue-600 text-white rounded text-center hover:bg-blue-700 transition duration-200"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
