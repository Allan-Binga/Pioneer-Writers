import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { LoaderCircle, FileText } from "lucide-react";
import { endpoint } from "../../server";
import axios from "axios";
import { useState, useEffect } from "react";
import { notify } from "../../utils/toast";
import moment from "moment";
import { Link } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${endpoint}/orders/all/orders`, {
          withCredentials: true,
        });
        setOrders(response.data);
      } catch (error) {
        notify.error("Failed to fetch orders");
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getCountdownColor = (deadline) => {
    const now = moment();
    const due = moment(deadline);
    const hoursLeft = due.diff(now, "hours");

    if (hoursLeft < 6) return "text-red-500";
    if (hoursLeft < 24) return "text-yellow-500";
    return "text-green-600";
  };

  const formatCountdown = (deadline) => {
    const now = moment();
    const due = moment(deadline);
    const duration = moment.duration(due.diff(now));
    if (duration.asSeconds() <= 0) return "Expired";
    return `${duration.days()}d ${duration.hours()}h ${duration.minutes()}m`;
  };

  const formatStatus = (status) => {
    const baseClass =
      "inline-block px-2 py-1 rounded-full text-xs font-medium capitalize";
    switch (status) {
      case "Pending":
        return `${baseClass} bg-blue-100 text-blue-800`;
      case "Paid":
        return `${baseClass} bg-green-100 text-green-800`;
      case "draft":
        return `${baseClass} bg-amber-100 text-amber-800`;
      case "in_progress":
        return `${baseClass} bg-blue-100 text-blue-800`;
      case "completed":
        return `${baseClass} bg-green-100 text-green-800`;
      default:
        return `${baseClass} bg-slate-100 text-slate-600`;
    }
  };

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter(
          (order) => order.order_status.toLowerCase() === activeTab
        );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold text-slate-900 mb-6 mt-8">
            Orders
          </h1>

          {/* Filter Tabs */}
          <div className="mb-6 flex flex-wrap gap-3">
            {["all", "pending", "paid", "draft", "completed", "cancelled"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setActiveTab(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
                    activeTab === status
                      ? "bg-slate-800 text-white"
                      : "bg-white text-slate-700 border border-slate-300"
                  }`}
                >
                  {status.replace("_", " ")}
                </button>
              )
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-60">
              <LoaderCircle className="animate-spin w-8 h-8 text-blue-500" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
              <FileText className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-4 text-slate-600 text-sm">
                No orders to display at the moment.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl shadow-sm bg-white border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-slate-600">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-600">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-600">
                      Deadline
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-600">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-600">
                      Actions
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-600">
                      User
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-600">
                      Writer
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.order_id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-700">
                        <code className="text-xs">
                          {order.order_id.slice(0, 8)}...
                        </code>
                      </td>
                      <td className="px-6 py-4 text-slate-800 font-medium">
                        {order.topic}
                      </td>
                      <td
                        className={`px-6 py-4 font-medium ${getCountdownColor(
                          order.deadline
                        )}`}
                      >
                        {formatCountdown(order.deadline)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={formatStatus(order.order_status)}>
                          {order.order_status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/order-details/${order.order_id}`}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Orders;
