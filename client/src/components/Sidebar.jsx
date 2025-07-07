import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  User,
  GraduationCap,
  BookOpenText,
  Wallet,
  Newspaper,
  Mail,
  Gauge,
} from "lucide-react";
import Logo from "../assets/logo.jpeg";
import axios from "axios";
import { endpoint } from "../server";
import { notify } from "../utils/toast";

function Sidebar() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentNavItem = navItems.find((item) =>
      item.submenu?.some((sub) => sub.path === location.pathname)
    );
    setOpenSubmenu(currentNavItem ? currentNavItem.name : null);
  }, [location.pathname]);

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
      submenu: [{ name: "All Writers", path: "/writers" }],
    },
    { name: "Inbox", path: "/inbox", icon: Mail },
    { name: "My Wallet", path: "/wallet", icon: Wallet },
    { name: "Profile", path: "/profile", icon: User },
    { name: "News", path: "/news", icon: Newspaper },
  ]; 

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="block lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
      >
        {showSidebar ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 md:w-72 bg-white z-40 shadow-sm rounded-tr-2xl rounded-br-2xl transform transition-transform duration-300
        ${showSidebar ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200/50">
          <div className="flex items-center space-x-3">
            <img
              src={Logo}
              alt="Pioneer-Writers"
              className="h-10 w-auto sm:h-12 object-contain"
            />
          </div>
        </div>

        {/* Nav items */}
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
                    <>
                      <div
                        onClick={() => handleSubmenuToggle(item.name)}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-md"
                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-800"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-6 h-6" />
                          <span className="text-lg font-semibold">
                            {item.name}
                          </span>
                        </div>
                      </div>
                      {openSubmenu === item.name && (
                        <ul className="ml-10 mt-2 space-y-2">
                          {item.submenu.map((sub) => {
                            const isSubActive = location.pathname === sub.path;
                            return (
                              <li key={sub.name}>
                                <Link
                                  to={sub.path}
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
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-md"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-lg font-semibold">{item.name}</span>
                    </Link>
                  )}
                </li>
              );
            })}

            {/* Logout Button */}
            <li className="pt-6 mt-6 border-t border-slate-200/50">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full text-left p-3 rounded-xl transition-all duration-200 text-slate-700 hover:bg-slate-50 hover:text-slate-800 cursor-pointer"
              >
                <LogOut className="w-6 h-6 text-slate-600" />
                <span className="text-lg font-semibold">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
