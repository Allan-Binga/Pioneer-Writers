import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.jpeg";
import { ChevronDown, Menu, X } from "lucide-react";

function LandingNav() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) setActiveDropdown(null); // Close dropdowns when closing menu
  };

  const navItems = [
    { name: "Home", path: "/home/home", color: "hover:text-blue-500" },
    {
      name: "About Us",
      subItems: [
        { name: "About Us", path: "/about-us" },
        { name: "FAQs", path: "/faqs" },
      ],
    },
    {
      name: "Services",
      subItems: [
        { name: "Content Services", path: "/content-services" },
        { name: "Full Class Help", path: "/class-help" },
      ],
    },
    {
      name: "Order Here",
      subItems: [{ name: "Order Assignment", path: "/new-order" }],
    },
    { name: "Contact Us", path: "/contact-us", color: "hover:text-blue-500" },
  ];

  return (
    <nav className="bg-white border-b border-slate-100 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          {/* Logo Section */}
          <Link to="/home" className="flex items-center ml-0 cursor-pointer">
            <img
              src={Logo}
              alt="Pioneer-Writers"
              className="h-8 w-auto sm:h-10 lg:h-12 object-contain"
            />
          </Link>

          {/* Spacer */}
          <div className="flex-grow"></div>

          {/* Hamburger Menu Button (Mobile) */}
          <button
            type="button"
            className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center">
            <div className="flex space-x-4 lg:space-x-6">
              {navItems.map((item) => (
                <div key={item.name} className="relative" ref={dropdownRef}>
                  {item.path ? (
                    <Link
                      to={item.path}
                      title={item.name}
                      className={`text-gray-700 ${item.color} transition-colors duration-200 text-xs font-medium flex items-center cursor-pointer`}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className={`text-gray-600 ${item.color} transition-colors duration-200 text-xs font-medium flex items-center cursor-pointer`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(item.name);
                      }}
                    >
                      {item.name}
                      {item.subItems && (
                        <ChevronDown
                          className={`ml-1 w-3 h-3 transition-transform duration-200 ${
                            activeDropdown === item.name ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>
                  )}

                  {item.subItems && activeDropdown === item.name && (
                    <div className="absolute left-0 mt-2 w-48 sm:w-56 bg-white rounded-md shadow-lg z-50 py-2">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className="flex items-center px-4 py-2 text-xs text-gray-600 hover:bg-amber-100 hover:text-gray-900 cursor-pointer"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100">
            <div className="container mx-auto px-4 py-4">
              {navItems.map((item) => (
                <div key={item.name} className="py-2">
                  {item.path ? (
                    <Link
                      to={item.path}
                      className={`text-gray-700 ${item.color} transition-colors duration-200 text-xs font-medium block`}
                      onClick={toggleMobileMenu}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <div>
                      <button
                        type="button"
                        className={`text-gray-600 ${item.color} transition-colors duration-200 text-xs font-medium flex items-center w-full`}
                        onClick={() => toggleDropdown(item.name)}
                      >
                        {item.name}
                        {item.subItems && (
                          <ChevronDown
                            className={`ml-1 w-3 h-3 transition-transform duration-200 ${
                              activeDropdown === item.name ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </button>
                      {item.subItems && activeDropdown === item.name && (
                        <div className="pl-4 mt-2 space-y-2">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              className="block text-xs text-gray-600 hover:bg-amber-100 hover:text-gray-900 px-4 py-2 rounded-md"
                              onClick={() => {
                                setActiveDropdown(null);
                                toggleMobileMenu();
                              }}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default LandingNav;
