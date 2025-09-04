import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Loader,
  CircleCheck,
  List,
  CheckLine,
  Scale,
} from "lucide-react";
import Logo from "../assets/logo.jpeg";
import axios from "axios";
import { notify } from "../utils/toast";
import { backend } from "../backend";
import { fetchProfile } from "../utils/profile";
import { isWriterLoggedIn } from "../utils/auth";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const isLoggedIn = isWriterLoggedIn();
  const location = useLocation();
  const navigate = useNavigate();
  const notificationCount = 3;
  const dropdownRef = useRef(null);

  const showAuthButtons = ["/new-order", "/order-payment"].includes(
    location.pathname
  );

  const navItems = [
    {
      name: "Place Bids",
      path: "/public-orders",
      color: "hover:text-amber-500",
    },
    {
      name: "My Orders",
      subItems: [
        {
          name: "In Progress",
          path: "/my-orders/in-progress",
          icon: <Loader className="w-4 h-4 mr-2" />,
        },
        {
          name: "Submitted",
          path: "/my-orders/submitted",
          icon: <CircleCheck className="w-4 h-4 mr-2" />,
        },
        {
          name: "Completed",
          path: "/my-orders/completed",
          icon: <CheckLine className="w-4 h-4 mr-2" />,
        },
        // {
        //   name: "Disputed",
        //   path: "/my-orders/disputed",
        //   icon: <Scale className="w-4 h-4 mr-2" />,
        // },
        {
          name: "All Orders",
          path: "/my-orders/all",
          icon: <List className="w-4 h-4 mr-2" />,
        },
      ],
      color: "hover:text-green-500",
    },
    {
      name: "Classes",
      path: "/classes",
      color: "hover:text-amber-500",
    },
    {
      name: "Funds",
      path: "/payments",
      color: "hover:text-amber-500",
    },

    { name: "Inbox", path: "/inbox", color: "hover:text-amber-500" },
    { name: "News", path: "/news", color: "hover:text-amber-500" },
  ];

  const profileItems = [
    {
      name: "Profile",
      path: "/profile",
      icon: <User className="w-4 h-4 mr-2" />,
    },
    {
      name: "Logout",
      icon: <LogOut className="w-4 h-4 mr-2" />,
    },
  ];

  useEffect(() => {
    if (isLoggedIn) {
      fetchProfile()
        .then((data) => {
          setProfile(data);
          localStorage.setItem("fullName", data.full_name);
        })
        .catch((err) => {
          console.error("Could not fetch profile:", err);
        });
    }
  }, [isLoggedIn]);

  const avatarUrl =
    profile?.profile_picture_url?.trim() ||
    "https://pioneer-writers-bucket.s3.eu-north-1.amazonaws.com/pioneer-writers/logo.webp";

  const fullName = profile?.full_name || "Writer";

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${backend}/auth/writer/sign-out`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        document.cookie = "writerPioneerSession=; Max-Age=0; path=/;";
        localStorage.clear();
        notify.success("Successfully logged out.");
        setTimeout(() => navigate("/sign-in"), 2000);
      } else {
        notify.error("You are not logged in.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      notify.error("Failed to log out.");
    }
  };

  return (
    <nav className="bg-white border-b border-slate-100 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo Section */}
          <Link
            to="/public-orders"
            className="flex items-center ml-0 cursor-pointer"
          >
            <img
              src={Logo}
              alt="Pioneer-Writers"
              className="h-10 w-auto sm:h-12 lg:h-14 object-contain"
            />
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex space-x-4 lg:space-x-8">
              {navItems.map((item) => (
                <div key={item.name} className="relative" ref={dropdownRef}>
                  {item.path ? (
                    <Link
                      to={item.path}
                      title={item.name}
                      className={`text-gray-700 ${item.color} transition-colors duration-200 text-sm font-medium flex items-center cursor-pointer`}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className={`text-gray-600 ${item.color} transition-colors duration-200 text-sm font-medium flex items-center cursor-pointer`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(item.name);
                      }}
                    >
                      {item.name}
                      {item.subItems && (
                        <ChevronDown
                          className={`ml-1 w-4 h-4 transition-transform duration-200 ${
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
                          className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-amber-100 hover:text-gray-900 cursor-pointer"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {subItem.icon}
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4 sm:space-x-6 mr-2">
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <div
                  title="Account"
                  className="flex items-center space-x-2 hover:bg-slate-100 rounded-full p-2 transition-all duration-200 cursor-pointer"
                  onClick={() => toggleDropdown("profile")}
                >
                  <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <span className="hidden lg:inline text-gray-600 text-sm font-medium">
                    {fullName}
                  </span>
                </div>
                {activeDropdown === "profile" && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 py-2">
                    {profileItems.map((item) => {
                      const hoverBg =
                        item.name === "Logout"
                          ? "hover:bg-red-400"
                          : "hover:bg-amber-100";

                      return item.name === "Logout" ? (
                        <button
                          key={item.name}
                          onClick={() => {
                            setActiveDropdown(null);
                            handleLogout();
                          }}
                          className={`flex items-center w-full px-4 py-3 text-left cursor-pointer text-sm text-gray-600 ${hoverBg} hover:text-gray-900`}
                        >
                          {item.icon}
                          {item.name}
                        </button>
                      ) : (
                        <Link
                          key={item.name}
                          to={item.path}
                          className={`flex items-center px-4 py-3 text-sm text-gray-600 ${hoverBg} hover:text-gray-900 cursor-pointer`}
                          onClick={() => setActiveDropdown(null)}
                        >
                          {item.icon}
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : showAuthButtons ? (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/sign-in"
                  className="text-gray-600 hover:text-gray-700 transition-colors duration-200 text-sm font-medium cursor-pointer"
                >
                  Log In
                </Link>
                <Link
                  to="/sign-up"
                  className="bg-gradient-to-r from-slate-600 to-slate-600 text-white px-6 py-2 rounded-full hover:from-slate-700 hover:to-slate-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm cursor-pointer"
                >
                  Sign Up
                </Link>
              </div>
            ) : null}

            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-600 hover:text-gray-600 transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white backdrop-blur-md bg-opacity-90 border-t border-slate-100 z-50 py-4 px-4 md:hidden">
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.path ? (
                  <Link
                    to={item.path}
                    className={`text-gray-600 ${item.color} text-sm font-medium cursor-pointer`}
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <div
                    className={`text-gray-600 ${item.color} text-sm font-medium cursor-pointer flex items-center`}
                    onClick={() =>
                      toggleDropdown(
                        activeDropdown === item.name ? null : item.name
                      )
                    }
                  >
                    {item.name}
                    {item.subItems && (
                      <ChevronDown
                        className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                          activeDropdown === item.name ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                )}

                {item.subItems && activeDropdown === item.name && (
                  <div className="ml-4 mt-2 space-y-2">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.path}
                        className="flex items-center text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
                        onClick={toggleMenu}
                      >
                        {subItem.icon}
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoggedIn && (
              <div>
                <span className="text-gray-600 text-sm font-medium">
                  {userName}
                </span>
                <div className="ml-4 mt-2 space-y-2">
                  {profileItems.map((item) =>
                    item.name === "Logout" ? (
                      <button
                        key={item.name}
                        onClick={() => {
                          setActiveDropdown(null);
                          handleLogout();
                          toggleMenu();
                        }}
                        className="flex items-center w-full px-4 py-3 text-left text-sm text-gray-600 hover:bg-red-200 hover:text-gray-900"
                      >
                        {item.icon}
                        {item.name}
                      </button>
                    ) : (
                      <Link
                        key={item.name}
                        to={item.path}
                        className="flex items-center px-4 py-3 text-sm text-gray-600 hover:bg-amber-100 hover:text-gray-900 cursor-pointer"
                        onClick={() => {
                          setActiveDropdown(null);
                          toggleMenu();
                        }}
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
