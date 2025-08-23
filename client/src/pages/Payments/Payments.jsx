import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";
import { notify } from "../../utils/toast";
import { X } from "lucide-react";
import { Dialog } from "@headlessui/react";
import { endpoint } from "../../server";
import PaypalLogo from "../../assets/paypal.png";
import StripeLogo from "../../assets/stripe.png";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

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
        notify.error("Failed to fetch payments");
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const formatStatus = (status) => {
    const baseClass =
      "inline-block px-2 py-1 rounded-full text-[10px] font-medium capitalize";
    switch (status) {
      case "pending":
        return `${baseClass} bg-blue-100 text-blue-800`;
      case "completed":
        return `${baseClass} bg-green-100 text-green-800`;
      case "failed":
        return `${baseClass} bg-red-100 text-red-800`;
      default:
        return `${baseClass} bg-slate-200 text-slate-600`;
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const filteredPayments =
    activeTab === "all"
      ? payments
      : payments.filter(
          (payment) =>
            payment.payment_status.toLowerCase() === activeTab.toLowerCase()
        );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Animated Background Waves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

        {/* Floating Particles */}
        {/* Left side */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute top-40 left-10 w-3 h-3 bg-pink-400 rounded-full animate-pulse opacity-50"></div>
        <div
          className="absolute bottom-28 left-16 w-2 h-2 bg-green-400 rounded-full animate-bounce opacity-40"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/5 w-4 h-4 bg-indigo-300 rounded-full animate-pulse opacity-30"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Right side */}
        <div
          className="absolute top-40 right-32 w-3 h-3 bg-amber-400 rounded-full animate-bounce opacity-40"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/4 w-2 h-2 bg-indigo-400 rounded-full animate-bounce opacity-50"
          style={{ animationDelay: "3s" }}
        ></div>
        <div className="absolute top-1/3 right-20 w-4 h-4 bg-green-300 rounded-full animate-pulse opacity-30"></div>
      </div>
      <Navbar />
      <main className="flex-1 pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-base sm:text-lg font-semibold text-slate-900 mb-6 mt-8">
            Payment History
          </h1>

          {/* Filter Tabs */}
          <div className="mb-6 flex flex-wrap gap-3">
            {["all", "pending", "failed", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`px-4 py-2 rounded-full text-[14px] font-medium capitalize ${
                  activeTab === status
                    ? "bg-slate-800 text-white"
                    : "bg-white text-slate-700 border border-slate-300"
                }`}
              >
                {status.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* Payments Table */}
          <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-slate-200">
            {loading ? (
              <div className="p-8 text-center text-slate-600 text-xs">
                Loading payments...
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="p-8 text-center text-slate-600 text-xs">
                No payments found.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700">
                <thead className="bg-slate-100 text-slate-800">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-sm">
                      Payment ID
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">
                      Amount ($)
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">
                      Method
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">
                      Paid At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredPayments.map((payment) => (
                    <tr
                      key={payment.payment_id}
                      onClick={() => setSelectedPayment(payment)}
                      className="hover:bg-slate-50 cursor-pointer"
                    >
                      <td className="px-4 py-3">{payment.payment_id}</td>
                      <td className="px-4 py-3">
                        ${parseFloat(payment.amount).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/order-details/${payment.order_id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-600 hover:underline"
                        >
                          {payment.order_id}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className={formatStatus(payment.payment_status)}>
                          {payment.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {payment.payment_method.toLowerCase() === "stripe" ? (
                            <img
                              src={StripeLogo}
                              alt="Stripe"
                              className="h-5 w-auto"
                            />
                          ) : (
                            <img
                              src={PaypalLogo}
                              alt="PayPal"
                              className="h-5 w-auto"
                            />
                          )}
                          <span>{payment.payment_method}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {formatDate(payment.paid_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {selectedPayment && (
        <Dialog
          open={!!selectedPayment}
          onClose={() => setSelectedPayment(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/30 backdrop-blur-sm"
        >
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative">
            <button
              onClick={() => setSelectedPayment(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"
            >
              <X className="hover:text-red-600" />
            </button>

            <h2 className="text-base font-semibold mb-4 text-slate-800">
              Payment Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
              <div>
                <strong>Payment ID:</strong> {selectedPayment.payment_id}
              </div>
              <div>
                <strong>Order ID:</strong>{" "}
                <Link
                  to={`/order-details/${selectedPayment.order_id}`}
                  className="text-blue-600 hover:underline"
                >
                  {selectedPayment.order_id}
                </Link>
              </div>
              <div>
                <strong>User ID:</strong> {selectedPayment.user_id}
              </div>
              <div>
                <strong>Amount:</strong> $
                {parseFloat(selectedPayment.amount).toFixed(2)}
              </div>
              <div>
                <strong>Payment Type:</strong> {selectedPayment.payment_type}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <span className={formatStatus(selectedPayment.payment_status)}>
                  {selectedPayment.payment_status}
                </span>
              </div>
              <div>
                <strong>Method:</strong> {selectedPayment.payment_method}
              </div>
              <div>
                <strong>Transaction Ref:</strong>{" "}
                {selectedPayment.transaction_reference}
              </div>
              <div>
                <strong>Paid At:</strong> {formatDate(selectedPayment.paid_at)}
              </div>
              <div>
                <strong>Created At:</strong>{" "}
                {formatDate(selectedPayment.created_at)}
              </div>
              <div>
                <strong>Updated At:</strong>{" "}
                {formatDate(selectedPayment.updated_at)}
              </div>
            </div>
          </div>
        </Dialog>
      )}

      <Footer />
    </div>
  );
}

export default Payments;
