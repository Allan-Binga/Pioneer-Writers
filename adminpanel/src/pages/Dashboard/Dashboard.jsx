import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  Users,
  FileText,
  ShieldCheck,
  Inbox,
  User,
  Scale,
  GraduationCap,
  Banknote,
} from "lucide-react"; // Added User, PenTool, Scale for Admin Tools
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { notify } from "../../utils/toast";
import { endpoint } from "../../server";
import Spinner from "../../components/Spinner";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState({
    stats: {},
    recentOrders: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${endpoint}/dashboard/administrator/dashboard`,
          { withCredentials: true }
        );

        // FIX: map response keys properly
        setDashboard({
          stats: {
            users: response.data.dashboardStats.userCount,
            totalWriters: response.data.dashboardStats.writerCount,
            platformRevenue: response.data.dashboardStats.totalRevenue,
            activeDisputes: response.data.dashboardStats.orderStats.disputed,
            totalOrders: response.data.dashboardStats.orderStats.all,
            submittedOrders: response.data.dashboardStats.orderStats.submitted,
          },
          recentOrders: response.data.recentOrders,
        });
      } catch (error) {
        notify.info("Failed to fetch admin dashboard");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner size="small" />
      </div>
    );
  }

  const statsItems = [
    {
      key: "users",
      label: "Users",
      icon: Users,
      color: "bg-blue-100 text-blue-700",
    },
    {
      key: "totalWriters",
      label: "Total Writers",
      icon: GraduationCap,
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      key: "platformRevenue",
      label: "Revenue (USD)",
      icon: Banknote,
      color: "bg-green-100 text-green-700",
    },
    {
      key: "activeDisputes",
      label: "Active Disputes",
      icon: Scale,
      color: "bg-red-100 text-red-700",
    },
    {
      key: "totalOrders",
      label: "All Orders",
      icon: FileText,
      color: "bg-slate-100 text-slate-700",
    },
    {
      key: "submittedOrders",
      label: "Submitted Orders",
      icon: Inbox,
      color: "bg-sky-100 text-sky-700",
    },
    {
      key: "verifiedClients",
      label: "Verified Clients",
      icon: ShieldCheck,
      color: "bg-emerald-100 text-emerald-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 px-4 md:px-10 max-w-7xl mx-auto w-full">
        <h1 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">
          Dashboard
        </h1>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {statsItems.map(({ key, label, icon: Icon, color }) => (
            <div
              key={key}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border border-slate-100 flex items-center space-x-5 group"
            >
              <div className={`p-4 rounded-full ${color}`}>
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-800 group-hover:text-slate-900">
                  {label}
                </p>
                <p className="text-xl font-bold text-slate-700">
                  {dashboard.stats?.[key] ?? 0}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Admin Tools */}
        <div className="flex flex-wrap gap-4 mb-12">
          <Link
            to="/clients"
            className="bg-purple-600 text-white px-6 py-3 rounded-full font-medium hover:bg-purple-700 transition flex items-center space-x-2"
          >
            <User className="w-5 h-5" />
            <span className="text-sm">Manage Users</span>
          </Link>
          <Link
            to="/writers"
            className="bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition flex items-center space-x-2"
          >
            <GraduationCap className="w-5 h-5" />
            <span className="text-sm">Manage Writers</span>
          </Link>
          <Link
            to="/disputes"
            className="bg-red-600 text-white px-6 py-3 rounded-full font-medium hover:bg-red-700 transition flex items-center space-x-2"
          >
            <Scale className="w-5 h-5" />
            <span className="text-sm">View Disputes</span>
          </Link>
        </div>

        {/* Recent Orders */}
        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-6">
            Recent Orders
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            {dashboard.recentOrders.length > 0 ? (
              <table className="w-full table-auto text-left">
                <thead className="bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-medium text-slate-500">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-xs font-medium text-slate-500">
                      Title
                    </th>
                    <th className="px-6 py-4 text-xs font-medium text-slate-500">
                      Client ID
                    </th>
                    <th className="px-6 py-4 text-xs font-medium text-slate-500">
                      Writer ID
                    </th>
                    <th className="px-6 py-4 text-xs font-medium text-slate-500">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-medium text-slate-500">
                      Date
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
                      <td className="px-6 py-4 text-sm">{order.title}</td>
                      <td className="px-6 py-4 text-sm">
                        {order.user_id ?? "-"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {order.writer_id ?? "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : order.status === "Pending"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "draft"
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {order.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-slate-500 text-center text-sm">
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

export default AdminDashboard;
