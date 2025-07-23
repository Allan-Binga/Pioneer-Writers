import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { CalendarClock, Hourglass, LoaderCircle, FileText } from "lucide-react";
import { endpoint } from "../../server";
import axios from "axios";
import { useState, useEffect } from "react";
import { notify } from "../../utils/toast";
import moment from "moment";
import { Link } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${endpoint}/all/orders`, {
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
    if (hoursLeft < 24) return "text-amber-500";
    return "text-green-600";
  };

  const formatCountdown = (deadline) => {
    const now = moment();
    const due = moment(deadline);
    const duration = moment.duration(due.diff(now));
    if (duration.asSeconds() <= 0) return "Expired";
    return `${duration.days()}d ${duration.hours()}h ${duration.minutes()}m`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Orders</h1>

          {loading ? (
            <div className="flex justify-center mt-10">
              <LoaderCircle className="animate-spin w-6 h-6 text-slate-500" />
            </div>
          ) : orders.length === 0 ? (
            <p className="text-slate-600">No orders found.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow-sm bg-white border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">
                      Deadline
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order.order_id}>
                      <td className="px-4 py-3 text-slate-700">
                        <code className="text-xs">
                          {order.order_id.slice(0, 8)}...
                        </code>
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        {order.title}
                      </td>
                      <td
                        className={`px-4 py-3 font-medium ${getCountdownColor(
                          order.deadline
                        )}`}
                      >
                        {formatCountdown(order.deadline)}
                      </td>
                      <td className="px-4 py-3 capitalize text-slate-700">
                        {order.status}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/orders/${order.order_id}`}
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
