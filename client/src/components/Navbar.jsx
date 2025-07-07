import { useState, useEffect } from "react";
import { Menu, X, Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/logo.jpeg";
import { isUserLoggedIn } from "../utils/auth";
import { fetchProfile } from "../utils/profile";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const isLoggedIn = isUserLoggedIn();
  const location = useLocation();
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

  useEffect(() => {
    if (isLoggedIn) {
      fetchProfile()
        .then((data) => {
          setProfile(data);
          localStorage.setItem("userName", data.username);
        })
        .catch((err) => {
          console.error("Could not fetch profile:", err);
        });
    }
  }, [isLoggedIn]);

  const avatarUrl = profile?.avatar_url || "https://via.placeholder.com/40";
  const userName = profile?.username || "User";

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <nav className="bg-white border-b border-slate-100 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center">
            <img
              src={Logo}
              alt="Pioneer-Writers"
              className="hidden sm:block h-8 w-auto sm:h-10 lg:h-12 object-contain"
            />
          </Link>

          {/* Center Nav (Desktop) */}
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

          {/* Right Section */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Notifications */}
            <Link
              to="/news"
              className="relative text-gray-600 hover:text-slate-600 transition-colors duration-200"
              title="News Notifications"
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-white text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isLoggedIn ? (
              <Link
                to="/profile"
                className="flex items-center space-x-2 hover:bg-slate-100 rounded-full p-1 sm:p-2 transition-all duration-200"
                title="Profile"
              >
                <img
                  src={avatarUrl}
                  alt="User Avatar"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-slate-200"
                />
                <span className="hidden lg:inline text-gray-600 text-sm font-medium">
                  {userName}
                </span>
              </Link>
            ) : showAuthButtons ? (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/sign-in"
                  className="text-slate-600 hover:text-slate-700 transition-colors duration-200 text-sm font-medium"
                >
                  Log In
                </Link>
                <Link
                  to="/sign-up"
                  className="bg-gradient-to-r from-slate-600 to-slate-600 text-white px-4 py-1.5 sm:px-6 sm:py-2 rounded-full hover:from-slate-700 hover:to-slate-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                >
                  Sign Up
                </Link>
              </div>
            ) : null}

            {/* Mobile Burger */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-600 hover:text-slate-600 transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white backdrop-blur-md bg-opacity-90 border-t border-slate-100 z-50 py-4 px-4 md:hidden">
          {/* Close button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-slate-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                onClick={toggleMenu}
                className="text-gray-600 hover:text-slate-600 transition-colors duration-200 text-sm font-medium"
              >
                {item}
              </a>
            ))}

            {isLoggedIn ? (
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-gray-600 hover:text-slate-600 transition-colors duration-200 text-sm font-medium py-2"
                onClick={toggleMenu}
              >
                <img
                  src={avatarUrl}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
                <span>{userName}</span>
              </Link>
            ) : showAuthButtons ? (
              <>
                <Link
                  to="/sign-in"
                  className="text-slate-600 hover:text-slate-700 text-sm font-medium py-2"
                  onClick={toggleMenu}
                >
                  Log In
                </Link>
                <Link
                  to="/sign-up"
                  className="bg-gradient-to-r from-slate-600 to-slate-600 text-white px-6 py-2 rounded-full hover:from-slate-700 hover:to-slate-700 shadow-md w-fit"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
