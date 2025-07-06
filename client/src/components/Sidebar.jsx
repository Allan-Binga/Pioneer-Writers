import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  BookOpenText,
  Wallet,
  Newspaper,
  PenTool,
  Gauge,
  ChevronRight as ArrowRight,
  ChevronDown as ArrowDown,
  Mail,
  X,
} from "lucide-react";
import Logo from "../assets/logo.jpeg";
import axios from "axios";
import { endpoint } from "../server";
import { notify } from "../utils/toast";

function Sidebar({ isMobile, isMobileSidebarOpen, closeMobileSidebar }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentNavItem = navItems.find((item) =>
      item.submenu?.some((sub) => sub.path === location.pathname)
    );
    setOpenSubmenu(currentNavItem ? currentNavItem.name : null);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSubmenuToggle = (itemName) => {
    setOpenSubmenu(openSubmenu === itemName ? null : itemName);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${endpoint}/auth/sign-out`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        document.cookie = "userPioneerSession=; Max-Age=0; path=/;";
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

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Gauge },
    {
      name: "Orders",
      icon: BookOpenText,
      submenu: [
        { name: "New Order", path: "/new-order" },
        { name: "My Orders", path: "/my-orders" },
      ],
    },
    {
      name: "Writers",
      icon: GraduationCap,
      submenu: [
        { name: "All Writers", path: "/writers" },
        { name: "Applications", path: "/writer-applications" },
      ],
    },
    { name: "Inbox", path: "/inbox", icon: Mail },
    { name: "My Wallet", path: "/wallet", icon: Wallet },
    { name: "Profile", path: "/profile", icon: User },
    { name: "News", path: "/news", icon: Newspaper },
  ];

  return (
    <div
      className={`
        ${isCollapsed ? "w-20" : "w-72"}
        bg-white fixed top-16 left-0 h-[calc(100vh-64px)]
        flex flex-col shadow-2xl transition-all duration-300 z-50
        border-r border-slate-200/50 overflow-y-auto
        ${isMobile ? (isMobileSidebarOpen ? "block" : "hidden") : "block"}
      `}
    >
      {/* Close Button on Mobile */}
      {isMobile && (
        <button
          onClick={closeMobileSidebar}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 lg:hidden"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      {/* Logo Section */}
      <div className="flex items-center justify-between p-5 border-b border-slate-200/50">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <img
              src={Logo}
              alt="Pioneer-Writers"
              className="h-10 w-auto sm:h-12 object-contain"
            />
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-3 p-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path
              ? location.pathname === item.path
              : item.submenu?.some((sub) => sub.path === location.pathname);
            const hasSubmenu = item.submenu;

            return (
              <li key={item.name}>
                {hasSubmenu ? (
                  <div
                    onClick={() => handleSubmenuToggle(item.name)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-md"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    <div
                      className={`flex items-center ${
                        isCollapsed ? "justify-center" : "space-x-3"
                      }`}
                    >
                      <Icon className="w-6 h-6 min-w-[24px] min-h-[24px]" />
                      {!isCollapsed && (
                        <span className="text-lg font-semibold">
                          {item.name}
                        </span>
                      )}
                    </div>
                    {!isCollapsed && (
                      <span>
                        {openSubmenu === item.name ? (
                          <ArrowDown className="w-5 h-5" />
                        ) : (
                          <ArrowRight className="w-5 h-5" />
                        )}
                      </span>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center ${
                      isCollapsed ? "justify-center" : "space-x-3"
                    } p-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-md"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                    title={isCollapsed ? item.name : ""}
                  >
                    <Icon className="w-6 h-6 min-w-[24px] min-h-[24px]" />
                    {!isCollapsed && (
                      <span className="text-lg font-semibold">{item.name}</span>
                    )}
                  </Link>
                )}

                {/* Submenu */}
                {openSubmenu === item.name && !isCollapsed && (
                  <ul className="ml-10 mt-2 space-y-2">
                    {item.submenu.map((sub) => {
                      const isSubActive = location.pathname === sub.path;
                      return (
                        <li key={sub.name}>
                          <Link
                            to={sub.path}
                            title={isCollapsed ? sub.name : ""}
                            className={`block px-4 py-2 rounded-lg text-base font-medium transition-colors duration-200 ${
                              isSubActive
                                ? "bg-slate-100 text-slate-800"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-700"
                            }`}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
          {/* Logout Button */}
          <li className="pt-6 mt-6 border-t border-slate-200/50">
            <button
              onClick={handleLogout}
              className={`flex items-center w-full text-left p-3 rounded-xl transition-all duration-200 ${
                isCollapsed ? "justify-center" : "space-x-3"
              } text-slate-700 hover:bg-slate-50 hover:text-slate-800`}
              title={isCollapsed ? "Logout" : ""}
            >
              <LogOut className="w-6 h-6 min-w-[24px] min-h-[24px] text-slate-600" />
              {!isCollapsed && (
                <span className="text-lg font-semibold">Logout</span>
              )}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
