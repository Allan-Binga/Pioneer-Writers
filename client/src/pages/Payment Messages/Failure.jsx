import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { notify } from "../../utils/toast";
import Navbar from "../../components/Navbar";
import { XCircle } from "lucide-react";
import { endpoint } from "../../server";

function Failure() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
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

  useEffect(() => {
    const cancelOrder = async () => {
      if (!orderId) return;

      try {
        await axios.post(
          `${endpoint}/checkout/cancel/paypal-payment`,
          { orderId },
          { withCredentials: true }
        );
        console.log("Order cancelled successfully.");
      } catch (error) {
        console.error("Cancel failed:", error);
      }
    };

    cancelOrder();
  }, [orderId]);

  const handleRetry = async (payment) => {
    try {
      const { order_id, payment_method } = payment;

      if (!order_id || !payment_method) {
        notify.error("Missing order or payment method");
        return;
      }

      let response;
      let redirectUrl;

      if (payment_method.toLowerCase() === "paypal") {
        response = await axios.post(
          `${endpoint}/checkout/pay-with-paypal`,
          { orderId: order_id },
          { withCredentials: true }
        );
        redirectUrl = response.data.approvalUrl;
      } else if (["stripe", "visa"].includes(payment_method.toLowerCase())) {
        response = await axios.post(
          `${endpoint}/checkout/stripe`,
          { orderId: order_id },
          { withCredentials: true }
        );
        redirectUrl = response.data.sessionUrl;
      } else {
        notify.error("Unsupported payment method");
        return;
      }

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        notify.error("Failed to get redirect URL");
      }
    } catch (error) {
      console.error("Retry error:", error);
      notify.error("Retry failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />

      <main className="flex-1 transition-all duration-300 pt-34 px-4">
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
                        <td className="px-4 py-2 flex items-center gap-2">
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

                          {["failed", ""].includes(
                            payment.payment_status?.toLowerCase()
                          ) && (
                            <button
                              onClick={() => handleRetry(payment)}
                              className="text-blue-600 text-xs underline hover:text-blue-800"
                            >
                              Retry
                            </button>
                          )}
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
