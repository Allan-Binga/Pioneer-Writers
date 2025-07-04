import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/logo.jpeg";
import { isUserLoggedIn, getUserRole } from "../utils/auth";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = isUserLoggedIn();
  const location = useLocation();

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

  return (
    <nav className="bg-white shadow-sm border-b border-purple-100 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center">
              <img
                src={Logo}
                alt="Pioneer-Writers"
                className="h-10 w-auto sm:h-12 object-contain"
              />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 absolute left-1/2 -translate-x-[45%]">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-600 hover:text-slate-900 transition-colors duration-200 text-md font-medium"
              >
                {item}
              </a>
            ))}

            {showAuthButtons && !isLoggedIn && (
              <div className="flex items-center space-x-3">
                <Link
                  to="/sign-in"
                  className="text-purple-600 hover:text-purple-700 transition-colors duration-200 text-sm font-medium"
                >
                  Log In
                </Link>
                <Link
                  to="/sign-up"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-purple-100 py-4">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-600 hover:text-purple-600 transition-colors duration-200 text-sm font-medium py-2"
                >
                  {item}
                </a>
              ))}

              {showAuthButtons && (
                <>
                  <Link
                    to="/sign-in"
                    className="text-purple-600 hover:text-purple-700 transition-colors duration-200 text-sm font-medium"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/sign-up"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md mt-2 w-fit"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
