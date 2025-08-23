import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";
import { notify } from "../../utils/toast";
import { backend } from "../../backend";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import { Link } from "react-router-dom";

function Classes() {
  const [classes, setClasses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${backend}/orders/my-orders/assigned`,
          { withCredentials: true }
        );
        setOrders(data);
      } catch (error) {
        notify.error("Failed to fetch orders.");
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-gray-100">
      <Navbar />
      <main className="flex-1 pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mt-12 mb-6">
            Active Classes
          </h1>

          {loading ? (
            <div className="p-8 text-center">
              <Spinner size="medium" />
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-slate-600 text-base bg-white rounded-2xl shadow-md border border-slate-200">
              No classes found.
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-100 text-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">
                      Class ID
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

export default Classes;
