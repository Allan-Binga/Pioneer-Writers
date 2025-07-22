import { useState, useEffect } from "react";
import axios from "axios";
import { notify } from "../../utils/toast";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { XCircle } from "lucide-react";
import { endpoint } from "../../server";

function Failure() {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${endpoint}/payments/all/my-payments`,
          { withCredentials: true }
        );
        setPayments(response.data);
      } catch (error) {
        notify.info("Failed to fetch payments");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${endpoint}/orders/my-orders`, {
          withCredentials: true,
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders");
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-34 px-4 md:px-10 max-w-7xl mx-auto w-full">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Failure Banner */}
          <div className="bg-red-100 border border-red-300 text-red-800 px-6 py-4 rounded-lg flex items-center gap-3">
            <XCircle className="w-6 h-6 text-red-600" />
            <div>
              <h2 className="font-semibold text-lg">Payment Failed!</h2>
              <p>Your payment could not be processed. Please try again.</p>
            </div>
          </div>

          {/* Payment Table */}
          <div className="bg-white shadow rounded-xl p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-slate-700 mb-4">
              Your Recent Payments
            </h3>

            {loading ? (
              <p className="text-gray-500">Loading payments...</p>
            ) : payments.length === 0 ? (
              <p className="text-gray-500">No payments found yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">
                        Order ID
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">
                        Amount
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {payments.map((payment, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2">{payment.order_id}</td>
                        <td className="px-4 py-2">${payment.amount}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
                              payment.payment_status?.toLowerCase() ===
                              "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {payment.payment_status}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Failure;
