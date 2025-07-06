import { useState } from "react";
import { Menu, X, Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/logo.jpeg";
import { isUserLoggedIn, getUserRole } from "../utils/auth";

function Navbar({ toggleMobileSidebar }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = isUserLoggedIn();
  const location = useLocation();
  const userName = localStorage.getItem("userName") || "User";
  const notificationCount = 3;

  const showAuthButtons = ["/new-order", "/order-payment"].includes(
    location.pathname
  );

  const navItems = [
    "Services",
    "How it Works",
    "Prices",
    "Our Writers",
    "FAQ",
    "Testimonials",
    "Essay Examples",
    "Influencer Program",
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-purple-100 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src={Logo}
                alt="Pioneer-Writers"
                className="hidden sm:block h-8 w-auto sm:h-10 lg:h-12 object-contain"
              />
            </Link>
          </div>

          {/* Desktop Center Nav */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-600 hover:text-slate-900 transition-colors duration-200 text-sm lg:text-base font-medium"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Notification Bell */}
            <Link
              to="/news"
              className="relative text-gray-600 hover:text-purple-600 transition-colors duration-200"
              title="News Notifications"
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-white text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Link>

            {/* Auth / Avatar */}
            {isLoggedIn ? (
              <Link
                to="/profile"
                className="flex items-center space-x-2 hover:bg-slate-100 rounded-full p-1 sm:p-2 transition-all duration-200"
                title="Profile"
              >
                <img
                  src="https://via.placeholder.com/40"
                  alt="User Avatar"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-purple-200"
                />
                <span className="hidden lg:inline text-gray-600 hover:text-slate-900 text-sm font-medium">
                  {userName}
                </span>
              </Link>
            ) : showAuthButtons ? (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/sign-in"
                  className="text-purple-600 hover:text-purple-700 transition-colors duration-200 text-sm font-medium"
                >
                  Log In
                </Link>
                <Link
                  to="/sign-up"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1.5 sm:px-6 sm:py-2 rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                >
                  Sign Up
                </Link>
              </div>
            ) : null}

            {/* Mobile Sidebar/Menu Toggle */}
            <button
              onClick={() => {
                toggleMenu();
                toggleMobileSidebar(); // toggle sidebar separately
              }}
              className="md:hidden text-gray-600 hover:text-purple-600 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
              onClick={toggleMenu}
            ></div>
            <div className="md:hidden border-t border-purple-100 py-4 bg-white z-50">
              <div className="flex flex-col space-y-3 px-4">
                {navItems.map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-gray-600 hover:text-purple-600 transition-colors duration-200 text-sm font-medium py-2"
                    onClick={toggleMenu}
                  >
                    {item}
                  </a>
                ))}
                {isLoggedIn ? (
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors duration-200 text-sm font-medium py-2"
                    onClick={toggleMenu}
                  >
                    <img
                      src="https://via.placeholder.com/40"
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full object-cover border border-purple-200"
                    />
                    <span>{userName}</span>
                  </Link>
                ) : showAuthButtons ? (
                  <>
                    <Link
                      to="/sign-in"
                      className="text-purple-600 hover:text-purple-700 transition-colors duration-200 text-sm font-medium py-2"
                      onClick={toggleMenu}
                    >
                      Log In
                    </Link>
                    <Link
                      to="/sign-up"
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md w-fit"
                      onClick={toggleMenu}
                    >
                      Sign Up
                    </Link>
                  </>
                ) : null}
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
