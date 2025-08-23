import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";
import { notify } from "../../utils/toast";
import { backend } from "../../backend";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import { Link, useParams } from "react-router-dom";

function MyOrders() {
  const { status } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const selectedStatus = status?.toLowerCase() || "all";

  // Check if order is urgent (less than 24 hours)
  const isUrgent = (deadline) => {
    const total = new Date(deadline) - new Date();
    return total > 0 && total < 24 * 60 * 60 * 1000;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${backend}/orders/writer/my-orders`, {
          params: {
            status: selectedStatus === "all" ? undefined : selectedStatus,
          },
          withCredentials: true,
        });
        setOrders(data);
      } catch (error) {
        notify.error("Failed to fetch orders.");
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [selectedStatus]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCountdownColor = (deadline) => {
    const now = moment();
    const due = moment(deadline);
    const hoursLeft = due.diff(now, "hours");

    if (hoursLeft < 6) return "text-red-500";
    if (hoursLeft < 24) return "text-amber-500";
    return "text-green-500";
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
      "inline-block px-2 py-1 rounded-full text-[10px] font-medium capitalize";
    switch (status.toLowerCase()) {
      case "public":
        return `${baseClass} bg-blue-100 text-blue-800`;
      case "completed":
        return `${baseClass} bg-green-100 text-green-800`;
      case "failed":
        return `${baseClass} bg-red-100 text-red-800`;
      default:
        return `${baseClass} bg-slate-200 text-slate-600`;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-gray-100">
      <Navbar />
      <main className="flex-1 pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-8 mb-6 capitalize">
            {selectedStatus === "all"
              ? "All Orders"
              : `${selectedStatus} Orders`}
          </h1>

          {loading ? (
            <div className="p-8 text-center">
              <Spinner size="medium" />
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-slate-600 text-base bg-white rounded-2xl shadow-md border border-slate-200">
              <p>No orders found.</p>
              <p className="mt-2">
                <a
                  href="/public-orders"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Start placing bids now →
                </a>
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-100 text-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">Topic</th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Deadline
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr
                      key={order.order_id}
                      className="hover:bg-blue-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <Link
                          to={`/order-details/${order.order_id}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {order.order_id}
                        </Link>
                      </td>
                      <td className="px-6 py-4">{order.topic}</td>
                      <td className="px-6 py-4">
                        {formatDate(order.deadline)}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        ${parseFloat(order.total_price).toFixed(2)}
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

export default MyOrders;
