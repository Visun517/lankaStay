import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Sample images for the collage
const images = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1465156799763-2c087c332922?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80",
  "https://images.pexels.com/photos/16508231/pexels-photo-16508231.jpeg",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
];

const Home = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center relative px-4">
        <div className="relative z-10 flex flex-col items-center justify-center py-24">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 text-center mb-4 leading-tight">
            Local Stays Global Standards <span className="text-blue-600">LankaStay</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 text-center mb-8 max-w-xl">
            Discover, compare, and book the best hotels and experiences in Sri Lanka. Your adventure starts here.
          </p>
          <Link
            to="/hotels"
            className="px-8 py-3 rounded-full bg-blue-600 text-white font-semibold text-lg shadow-lg hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>
        {/* Collage Images - Show Off Section */}
        <div className="relative z-20 w-full flex justify-center -mt-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-white px-4 py-6 rounded-3xl shadow-2xl border border-gray-100 max-w-5xl">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt=""
                className="rounded-2xl shadow-lg object-cover w-40 h-56 sm:w-44 sm:h-60 transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-2xl cursor-pointer"
                style={{ objectPosition: "center" }}
                tabIndex={-1}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home; 