import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  User,
  ChevronLeft,
  ChevronRight,
  MessagesSquare,
  GraduationCap,
  BookOpenText,
  Wallet,
  Newspaper,
  PenTool,
  Gauge,
  ChevronRight as ArrowRight,
  ChevronDown as ArrowDown,
} from "lucide-react";

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();

  // Automatically open submenu based on current path
  useEffect(() => {
    const currentNavItem = navItems.find((item) =>
      item.submenu?.some((sub) => sub.path === location.pathname)
    );
    if (currentNavItem) {
      setOpenSubmenu(currentNavItem.name);
    } else {
      setOpenSubmenu(null); // Close submenu if no match
    }
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSubmenuToggle = (itemName) => {
    setOpenSubmenu(openSubmenu === itemName ? null : itemName);
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Gauge },
    {
      name: "Orders",
      icon: BookOpenText,
      submenu: [
        { name: "My Orders", path: "/my-orders" },
        { name: "Place Order", path: "/place-order" },
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
    { name: "Chat", path: "/chat", icon: MessagesSquare },
    { name: "My Wallet", path: "/wallet", icon: Wallet },
    { name: "Profile", path: "/profile", icon: User },
    { name: "News", path: "/news", icon: Newspaper },
  ];

  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-white fixed top-16 left-0 h-[calc(100vh-64px)] flex flex-col shadow-xl transition-all duration-300 z-40 border-r border-purple-200 overflow-y-auto`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
              <PenTool className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Pioneer Writers
            </span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Separator */}
      <div className="border-t border-gray-200 mx-4 my-2" />

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 p-4">
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
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                        : "text-purple-700 hover:bg-purple-100 hover:text-purple-900"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {Icon && (
                        <Icon
                          className={`w-6 h-6 ${
                            isActive ? "text-white" : "text-purple-600"
                          }`}
                        />
                      )}
                      {!isCollapsed && (
                        <span className="text-base font-medium">
                          {item.name}
                        </span>
                      )}
                    </div>
                    {!isCollapsed && (
                      <span>
                        {openSubmenu === item.name ? (
                          <ArrowDown className="w-4 h-4" />
                        ) : (
                          <ArrowRight className="w-4 h-4" />
                        )}
                      </span>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                        : "text-purple-700 hover:bg-purple-100 hover:text-purple-900"
                    }`}
                  >
                    {Icon && (
                      <Icon
                        className={`w-6 h-6 ${
                          isActive ? "text-white" : "text-purple-600"
                        }`}
                      />
                    )}
                    {!isCollapsed && (
                      <span className="text-base font-medium">{item.name}</span>
                    )}
                  </Link>
                )}

                {/* Submenu */}
                {openSubmenu === item.name && !isCollapsed && (
                  <ul className="ml-10 mt-2 space-y-1">
                    {item.submenu.map((sub) => {
                      const isSubActive = location.pathname === sub.path;
                      return (
                        <li key={sub.name}>
                          <Link
                            to={sub.path}
                            className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              isSubActive
                                ? "bg-purple-500 text-white"
                                : "text-purple-600 hover:bg-purple-100"
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
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
