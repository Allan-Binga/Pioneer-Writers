import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Bell,
  User,
  LogOut,
  ShieldUser,
  Inbox,
  ChevronDown,
  GraduationCap,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.jpeg";
import axios from "axios";
import { isUserLoggedIn } from "../utils/auth";
import { fetchProfile } from "../utils/profile";
import { notify } from "../utils/toast";
import { endpoint } from "../server";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const isLoggedIn = isUserLoggedIn();
  const location = useLocation();
  const navigate = useNavigate();
  const notificationCount = 3;
  const dropdownRef = useRef(null);

  const navItems = [
    { name: "Dashboard", color: "hover:text-amber-600" },
    { name: "Orders", color: "hover:text-amber-600" },
    {
      name: "Users",
      subItems: [
        {
          name: "Clients",
          path: "/clients",
          icon: <User className="w-4 h-4 mr-2" />,
        },
        {
          name: "Writers",
          path: "/writers",
          icon: <GraduationCap className="w-4 h-4 mr-2" />,
        },
        {
          name: "Administrators",
          path: "/administrators",
          icon: <ShieldUser className="w-4 h-4 mr-2" />,
        },
      ],
      color: "hover:text-amber-600",
    },
    {
      name: "Platform Services",
      subItems: [
        {
          name: "News Center",
          path: "/news",
          icon: <Bell className="w-4 h-4 mr-2" />,
        },
        {
          name: "Message Center",
          path: "/email-center",
          icon: <Inbox className="w-4 h-4 mr-2" />,
        },
      ],
      color: "hover:text-amber-600",
    },
    {
      name: "Settings",
      subItems: [
        {
          name: "Platform Settings",
          path: "/settings",
          icon: <ChevronDown className="w-4 h-4 mr-2" />,
        },
      ],
      color: "hover:text-amber-600",
    },
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
          localStorage.setItem("userName", data.username);
        })
        .catch((err) => {
          console.error("Could not fetch profile:", err);
        });
    }
  }, [isLoggedIn]);

  const avatarUrl = profile?.avatar_url || "https://via.placeholder.com/40";
  const userName = profile?.full_name || "User";

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const isNavigable = (itemName) =>
    ["Dashboard", "Orders", "Inbox", "News"].includes(itemName);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${endpoint}/auth/sign-out`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        document.cookie = "pioneerAdminSession=; Max-Age=0; path=/;";
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
        <div className="flex items-center justify-between h-24">
          {/* Logo Section */}
          <Link to="/" className="flex items-center ml-4">
            <img
              src={Logo}
              alt="Pioneer-Writers"
              className="h-10 w-auto sm:h-12 lg:h-14 object-contain"
            />
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex space-x-8">
              {navItems.map((item) => (
                <div key={item.name} className="relative" ref={dropdownRef}>
                  {isNavigable(item.name) ? (
                    <Link
                      to={`/${item.name.toLowerCase()}`}
                      className={`text-gray-600 ${item.color} transition-colors duration-200 text-base font-medium flex items-center`}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className={`text-gray-600 ${item.color} transition-colors duration-200 text-base font-medium flex items-center`}
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
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 py-2">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className="flex items-center px-4 py-3 text-base text-gray-600 hover:bg-amber-100 hover:text-gray-900"
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
            <Link
              to="/news"
              className="relative text-gray-600 hover:text-purple-500 transition-colors duration-200"
              title="News Notifications"
            >
              <Bell className="w-7 h-7" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <div
                  className="flex items-center space-x-2 hover:bg-slate-100 rounded-full p-2 transition-all duration-200 cursor-pointer"
                  onClick={() => toggleDropdown("profile")}
                >
                  <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <span className="hidden lg:inline text-gray-600 text-base font-medium">
                    {userName}
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
                          className={`flex items-center w-full px-4 py-3 text-left cursor-pointer text-base text-gray-600 ${hoverBg} hover:text-gray-900`}
                        >
                          {item.icon}
                          {item.name}
                        </button>
                      ) : (
                        <Link
                          key={item.name}
                          to={item.path}
                          className={`flex items-center px-4 py-3 text-base text-gray-600 ${hoverBg} hover:text-gray-900`}
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
                  className="text-gray-600 hover:text-gray-700 transition-colors duration-200 text-base font-medium"
                >
                  Log In
                </Link>
                <Link
                  to="/sign-up"
                  className="bg-gradient-to-r from-slate-600 to-slate-600 text-white px-6 py-2 rounded-full hover:from-slate-700 hover:to-slate-700 transition-all duration-200 shadow-md hover:shadow-lg text-base"
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
                {isNavigable(item.name) ? (
                  <Link
                    to={`/${item.name.toLowerCase()}`}
                    className={`text-gray-600 ${item.color} text-base font-medium`}
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <div
                    className={`text-gray-600 ${item.color} text-base font-medium cursor-pointer flex items-center`}
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
                        className="flex items-center text-base text-gray-600 hover:text-gray-900"
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
                <span className="text-gray-600 text-base font-medium">
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
                        className="flex items-center w-full px-4 py-3 text-left text-base text-gray-600 hover:bg-red-200 hover:text-gray-900"
                      >
                        {item.icon}
                        {item.name}
                      </button>
                    ) : (
                      <Link
                        key={item.name}
                        to={item.path}
                        className="flex items-center px-4 py-3 text-base text-gray-600 hover:bg-amber-100 hover:text-gray-900"
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
