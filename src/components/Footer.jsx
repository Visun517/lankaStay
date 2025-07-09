import React from "react";

const Footer = () => (
  <footer className="bg-black w-full mt-16 relative overflow-hidden z-50">
    {/* Background decorative elements */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-300/5 to-transparent rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-gray-600/10 to-transparent rounded-full blur-2xl"></div>
    
    <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
      {/* Main footer content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand section */}
        <div className="lg:col-span-1">
          <div className="mb-6">
            <span className="text-3xl font-black tracking-tight text-gray-100">
              Lanka<span className="text-yellow-300">Stay</span>
            </span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Discover the beauty of Sri Lanka with our curated collection of hotels, experiences, and travel packages.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Facebook" className="group">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-yellow-300 transition-all duration-300">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-gray-400 group-hover:text-black">
                  <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/>
                </svg>
              </div>
            </a>
            <a href="#" aria-label="Instagram" className="group">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-yellow-300 transition-all duration-300">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-gray-400 group-hover:text-black">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.497 5.782 2.225 7.148 2.163 8.414 2.105 8.794 2.094 12 2.094m0-2.163C8.741 0 8.332.012 7.052.07 5.771.128 4.659.334 3.678 1.315c-.98.98-1.187 2.092-1.245 3.373C2.012 5.668 2 6.077 2 12c0 5.923.012 6.332.07 7.612.058 1.281.265 2.393 1.245 3.373.98.98 2.092 1.187 3.373 1.245C8.332 23.988 8.741 24 12 24s3.668-.012 4.948-.07c1.281-.058 2.393-.265 3.373-1.245.98-.98 1.187-2.092 1.245-3.373.058-1.28.07-1.689.07-7.612 0-5.923-.012-6.332-.07-7.612-.058-1.281-.265-2.393-1.245-3.373-.98-.98-1.187-2.092-1.245-3.373-1.245C15.668.012 15.259 0 12 0zm0 5.838A6.162 6.162 0 0 0 5.838 12 6.162 6.162 0 0 0 12 18.162 6.162 6.162 0 0 0 18.162 12 6.162 6.162 0 0 0 12 5.838zm0 10.162A3.999 3.999 0 1 1 12 8a3.999 3.999 0 0 1 0 7.999zm6.406-11.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/>
                </svg>
              </div>
            </a>
            <a href="#" aria-label="YouTube" className="group">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-yellow-300 transition-all duration-300">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-gray-400 group-hover:text-black">
                  <path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.112C19.645 3.5 12 3.5 12 3.5s-7.645 0-9.386.574A2.994 2.994 0 0 0 .502 6.186C0 7.927 0 12 0 12s0 4.073.502 5.814a2.994 2.994 0 0 0 2.112 2.112C4.355 20.5 12 20.5 12 20.5s7.645 0 9.386-.574a2.994 2.994 0 0 0 2.112-2.112C24 16.073 24 12 24 12s0-4.073-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
            </a>
          </div>
        </div>
        {/* Links sections */}
        <div>
          <h3 className="font-semibold mb-6 text-gray-100 text-lg">About LankaStay</h3>
          <ul className="space-y-4">
            <li><a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors duration-200 text-sm">About Us</a></li>
            <li><a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors duration-200 text-sm">Press</a></li>
            <li><a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors duration-200 text-sm">Careers</a></li>
            <li><a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors duration-200 text-sm">Contact</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-6 text-gray-100 text-lg">Explore</h3>
          <ul className="space-y-4">
            <li><a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors duration-200 text-sm">Hotels</a></li>
            <li><a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors duration-200 text-sm">Packages</a></li>
            <li><a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors duration-200 text-sm">Experiences</a></li>
            <li><a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors duration-200 text-sm">Help Center</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-6 text-gray-100 text-lg">For Partners</h3>
          <ul className="space-y-4">
            <li><a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors duration-200 text-sm">List Your Hotel</a></li>
            <li><a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors duration-200 text-sm">Partner Login</a></li>
            <li><a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors duration-200 text-sm">Affiliate Program</a></li>
            <li><a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors duration-200 text-sm">LankaStay Blog</a></li>
          </ul>
        </div>
      </div>

      {/* Full-width divider */}
      <hr className="border-gray-800 w-full" />

      {/* Bottom section */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <span>© {new Date().getFullYear()} LankaStay. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-yellow-300 transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-yellow-300 transition-colors duration-200">Terms of Service</a>
            <a href="#" className="hover:text-yellow-300 transition-colors duration-200">Cookie Policy</a>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Made with</span>
          <span className="text-yellow-300">❤</span>
          <span>in Sri Lanka</span>
        </div>
        <div className="mt-6 text-xs text-gray-500 text-center w-full">
          LankaStay makes no guarantees for availability or prices. See our{' '}
          <a href="#" className="text-yellow-300 hover:underline">Terms</a>.
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;