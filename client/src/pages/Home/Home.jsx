import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Spinner from "../../components/Spinner";
import {
  CheckCircle,
  FileText,
  Ban,
  Scale,
  FileClock,
  FileEdit,
  BanknoteArrowUp,
  FileCheck,
  GraduationCap,
  Hourglass,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { notify } from "../../utils/toast";
import { endpoint } from "../../server";

function Home() {
  const [dashboard, setDashboard] = useState({
    dashboardStats: {},
    recentOrders: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${endpoint}/orders/dashboard-details`,
          {
            withCredentials: true,
          }
        );
        setDashboard(response.data);
      } catch (error) {
        notify.info("Failed to fetch dashboard details");
        console.error("Failed to fetch dashboard details.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 space-y-4">
        <Spinner size="small" />
      </div>
    );
  }

  const dashboardItems = [
    {
      key: "completed",
      label: "Completed Orders",
      icon: CheckCircle,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      key: "inProgress",
      label: "Orders In Progress",
      icon: Hourglass,
      color: "bg-blue-100 text-blue-600",
    },
    {
      key: "all",
      label: "All Orders",
      icon: FileText,
      color: "bg-slate-100 text-slate-600",
    },
    {
      key: "disputed",
      label: "Disputed Orders",
      icon: Scale,
      color: "bg-red-100 text-red-600",
    },
    {
      key: "unconfirmed",
      label: "Unconfirmed Orders",
      icon: FileClock,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      key: "draft",
      label: "Draft Orders",
      icon: FileEdit,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      key: "paid",
      label: "Paid Orders",
      icon: BanknoteArrowUp,
      color: "bg-green-100 text-green-600",
    },
    {
      key: "cancelled",
      label: "Canceled Orders",
      icon: Ban,
      color: "bg-rose-100 text-rose-600",
    },
    {
      key: "submitted",
      label: "Submitted Orders",
      icon: FileCheck,
      color: "bg-sky-100 text-sky-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Animated Background Waves - Fixed z-index */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Top wave */}
        <svg
          className="absolute top-0 left-0 w-full h-[200px] opacity-10"
          viewBox="0 0 1000 200"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
          </defs>
          <path
            d="M0,200 Q250,50 500,200 T1000,200 L1000,0 L0,0 Z"
            fill="url(#wave1)"
            className="animate-pulse"
          />
        </svg>

        {/* Bottom wave */}
        <svg
          className="absolute bottom-0 left-0 w-full h-[200px] opacity-5"
          viewBox="0 0 1000 200"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>
          <path
            d="M0,0 Q250,150 500,0 T1000,0 L1000,200 L0,200 Z"
            fill="url(#wave2)"
            className="animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </svg>

        {/* Floating Particles - Layer 1 (Large) */}
        <div className="absolute top-20 left-20 w-3 h-3 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full animate-bounce opacity-60 shadow-lg"></div>
        <div className="absolute top-32 right-28 w-4 h-4 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full animate-pulse opacity-50 shadow-md"></div>
        <div
          className="absolute top-1/3 left-1/4 w-5 h-5 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full animate-bounce opacity-40 shadow-lg"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-3 h-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-pulse opacity-45 shadow-md"
          style={{ animationDelay: "2.5s" }}
        ></div>

        {/* Floating Particles - Layer 2 (Medium) */}
        <div
          className="absolute top-40 left-10 w-2 h-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full animate-bounce opacity-50"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-40 right-16 w-3 h-3 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-full animate-pulse opacity-35"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-60 left-1/3 w-2 h-2 bg-gradient-to-br from-indigo-400 to-blue-600 rounded-full animate-bounce opacity-45"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-60 left-20 w-4 h-4 bg-gradient-to-br from-lime-400 to-green-600 rounded-full animate-pulse opacity-30"
          style={{ animationDelay: "3s" }}
        ></div>

        {/* Floating Particles - Layer 3 (Small & Scattered) */}
        <div
          className="absolute top-16 left-1/2 w-1.5 h-1.5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full animate-bounce opacity-40"
          style={{ animationDelay: "0.8s" }}
        ></div>
        <div
          className="absolute top-80 right-40 w-2 h-2 bg-gradient-to-br from-red-400 to-pink-500 rounded-full animate-pulse opacity-35"
          style={{ animationDelay: "1.8s" }}
        ></div>
        <div
          className="absolute bottom-20 left-40 w-1.5 h-1.5 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full animate-bounce opacity-50"
          style={{ animationDelay: "2.3s" }}
        ></div>
        <div
          className="absolute top-1/4 right-1/4 w-2 h-2 bg-gradient-to-br from-fuchsia-400 to-violet-500 rounded-full animate-pulse opacity-40"
          style={{ animationDelay: "1.2s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/5 w-3 h-3 bg-gradient-to-br from-emerald-300 to-teal-500 rounded-full animate-bounce opacity-35"
          style={{ animationDelay: "2.8s" }}
        ></div>

        {/* Floating Particles - Layer 4 (Extra decorative) */}
        <div
          className="absolute top-28 right-1/5 w-1 h-1 bg-gradient-to-br from-orange-400 to-red-500 rounded-full animate-pulse opacity-30"
          style={{ animationDelay: "0.3s" }}
        ></div>
        <div
          className="absolute top-3/4 left-1/6 w-2 h-2 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-full animate-bounce opacity-45"
          style={{ animationDelay: "1.7s" }}
        ></div>
        <div
          className="absolute bottom-16 right-1/6 w-1.5 h-1.5 bg-gradient-to-br from-purple-300 to-indigo-400 rounded-full animate-pulse opacity-40"
          style={{ animationDelay: "2.1s" }}
        ></div>
        <div
          className="absolute top-44 left-3/4 w-2 h-2 bg-gradient-to-br from-green-300 to-emerald-400 rounded-full animate-bounce opacity-35"
          style={{ animationDelay: "3.2s" }}
        ></div>
        <div
          className="absolute bottom-44 right-3/4 w-1 h-1 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full animate-pulse opacity-50"
          style={{ animationDelay: "0.7s" }}
        ></div>

        {/* Corner accent particles */}
        <div
          className="absolute top-8 left-8 w-2 h-2 bg-gradient-to-br from-blue-300 to-cyan-400 rounded-full animate-bounce opacity-30"
          style={{ animationDelay: "1.4s" }}
        ></div>
        <div
          className="absolute top-8 right-8 w-1.5 h-1.5 bg-gradient-to-br from-violet-300 to-purple-400 rounded-full animate-pulse opacity-35"
          style={{ animationDelay: "2.6s" }}
        ></div>
        <div
          className="absolute bottom-8 left-8 w-1 h-1 bg-gradient-to-br from-emerald-300 to-green-400 rounded-full animate-bounce opacity-40"
          style={{ animationDelay: "0.9s" }}
        ></div>
        <div
          className="absolute bottom-8 right-8 w-2 h-2 bg-gradient-to-br from-amber-300 to-yellow-400 rounded-full animate-pulse opacity-30"
          style={{ animationDelay: "1.9s" }}
        ></div>

        {/* Center area accent particles */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gradient-to-br from-rose-300 to-pink-400 rounded-full animate-pulse opacity-25"
          style={{ animationDelay: "2.4s" }}
        ></div>
        <div
          className="absolute top-1/3 left-1/3 w-1.5 h-1.5 bg-gradient-to-br from-indigo-300 to-blue-400 rounded-full animate-bounce opacity-35"
          style={{ animationDelay: "3.1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/5 w-1 h-1 bg-gradient-to-br from-teal-300 to-cyan-400 rounded-full animate-pulse opacity-40"
          style={{ animationDelay: "0.6s" }}
        ></div>
      </div>
      <main className="flex-1 pt-20 px-4 md:px-10 max-w-7xl mx-auto w-full relative z-10">
        <h1 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">
          Welcome Back!
        </h1>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {dashboardItems.map(({ key, label, icon: Icon, color }) => (
            <Link
              key={key}
              to={`/my-orders/${key}`}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border border-slate-100 flex items-center space-x-5 group"
            >
              <div className={`p-4 rounded-full ${color}`}>
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-md font-semibold text-slate-800 group-hover:text-slate-900">
                  {label}
                </p>
                <p className="text-xl font-bold text-slate-700">
                  {dashboard.dashboardStats?.[key] ?? 0}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Call-to-Action Buttons - Centered */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link
            to="/new-order"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3"
          >
            <FileText className="w-5 h-5" />
            Place Order
          </Link>
          <Link
            to="/class-help"
            className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 px-8 py-4 rounded-2xl font-semibold hover:from-amber-500 hover:to-amber-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3"
          >
            <GraduationCap className="w-5 h-5" />
            Online Class Help
          </Link>
        </div>

        {/* Recent Orders Section */}
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            Recent Orders
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {dashboard.recentOrders.length > 0 ? (
              <table className="w-full table-auto text-left">
                <thead className="bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-sm font-medium text-slate-500">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-sm font-medium text-slate-500 text-center">
                      Title
                    </th>
                    <th className="px-6 py-4 text-sm font-medium text-slate-500 text-center">
                      Payment Status
                    </th>
                    <th className="px-6 py-4 text-sm font-medium text-slate-500 text-center">
                      Date
                    </th>
                    <th className="px-6 py-4 text-sm font-medium text-slate-500 text-center">
                      Assignment Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-mono text-xs text-slate-600 hover:underline">
                        <Link to={`/order-details/${order.id}`}>
                          {order.id}
                        </Link>
                      </td>

                      <td className="px-6 py-4 text-sm text-center">
                        {order.title}
                      </td>

                      {/* Payment Status - Centered */}
                      <td className="px-6 py-4 text-sm text-center">
                        <span
                          className={`px-3 py-1 rounded-full font-medium ${
                            order.payment_status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : order.payment_status === "Pending"
                              ? "bg-blue-100 text-blue-700"
                              : order.payment_status === "Canceled"
                              ? "bg-amber-100 text-amber-700"
                              : order.payment_status === "Draft"
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500 text-center">
                        {order.date}
                      </td>

                      {/* Assignment Status - Centered & Capitalized */}
                      <td className="px-6 py-4 text-sm text-center">
                        <span
                          className={`px-3 py-1 rounded-full font-medium ${
                            order.assignmentStatus === "assigned"
                              ? "bg-green-100 text-green-700"
                              : order.assignmentStatus === "public"
                              ? "bg-blue-100 text-blue-700"
                              : order.assignmentStatus === "submitted"
                              ? "bg-amber-100 text-amber-700"
                              : order.assignmentStatus === "disputed"
                              ? "bg-red-100 text-red-700"
                              : order.assignmentStatus === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {order.assignmentStatus.charAt(0).toUpperCase() +
                            order.assignmentStatus.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-slate-500 text-center">
                No recent orders found.
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
