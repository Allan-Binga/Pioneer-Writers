import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Spinner from "../../components/Spinner";
import {
  CheckCircle,
  Loader,
  FileText,
  Ban,
  Scale,
  FileClock,
  FileEdit,
  BanknoteArrowUp,
  FileCheck,
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
        <Spinner size="medium" />
        <div className="text-lg text-slate-500">Loading your dashboard...</div>
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
      icon: Loader,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 px-4 md:px-10 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-semibold text-slate-800 mt-8 mb-4">
          Welcome Back!
        </h1>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {dashboardItems.map(({ key, label, icon: Icon, color }) => (
            <div
              key={key}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border border-slate-100 flex items-center space-x-5 group"
            >
              <div className={`p-4 rounded-full ${color}`}>
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-800 group-hover:text-slate-900">
                  {label}
                </p>
                <p className="text-2xl font-bold text-slate-700">
                  {dashboard.dashboardStats?.[key] ?? 0}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-12">
          <Link
            to="/new-order"
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition"
          >
            📄 Place Order
          </Link>
          <Link
            to="/class-help"
            className="bg-amber-400 text-slate-900 px-6 py-3 rounded-full font-medium hover:bg-amber-500 transition"
          >
            🎓 Click here for online class help
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
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-sm font-medium text-slate-500">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-sm font-medium text-slate-500">
                      Title
                    </th>
                    <th className="px-6 py-4 text-sm font-medium text-slate-500">
                      Status
                    </th>
                    <th className="px-6 py-4 text-sm font-medium text-slate-500">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-mono text-sm text-slate-600 hover:underline">
                        <Link to={`/order-details/${order.id}`}>
                          {order.id}
                        </Link>
                      </td>

                      <td className="px-6 py-4">{order.title}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : order.status === "In Progress"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "Draft"
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {order.date}
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
