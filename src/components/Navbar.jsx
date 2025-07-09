import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="flex items-center justify-between px-6 py-4">
    <div className="flex items-center gap-2">
      <span className="text-2xl font-extrabold text-gray-800 tracking-tight">
        Lanka<span className="text-blue-600">Stay</span>
      </span>
    </div>
    <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
      <Link to="/about" className="hover:text-blue-600">About</Link>
      <Link to="/hotels" className="hover:text-blue-600">Explore</Link>
      <Link to="/login" className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Sign In</Link>
      <Link to="/register" className="px-4 py-2 rounded-full border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition">Sign Up</Link>
    </div>
  </nav>
);

export default Navbar; 