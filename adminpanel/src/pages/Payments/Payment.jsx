import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { endpoint } from "../../server";
import axios from "axios";
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { notify } from "../../utils/toast";
import { X } from "lucide-react";
import StripeLogo from "../../assets/stripe.png";
import PaypalLogo from "../../assets/paypal.png";

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
          `${endpoint}/payments/administrator/all-payments`,
          {
            withCredentials: true,
          }
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
      "inline-block px-2 py-1 rounded-full text-xs font-medium capitalize";
    switch (status) {
      case "pending":
        return `${baseClass} bg-blue-100 text-blue-800`;
      case "completed":
        return `${baseClass} bg-green-100 text-green-800`;
      case "failed":
        return `${baseClass} bg-red-100 text-red-800`;
      default:
        return `${baseClass} bg-slate-amber text-amber-600`;
    }
  };

  const fileteredPayments =
    activeTab === "all"
      ? payments
      : payments.filter(
          (payment) => payment.payment_status.toLowerCase() === activeTab
        );

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold text-slate-900 mb-6 mt-8">
            Payments
          </h1>

          {/* Filter Tabs */}
          <div className="mb-6 flex flex-wrap gap-3">
            {["all", "pending", "failed", "cancelled"].map((status) => (
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
            ))}
          </div>

          {/* Payments Summary Table */}
          <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-slate-200">
            {loading ? (
              <div className="p-8 text-center text-slate-600">
                Loading payments...
              </div>
            ) : fileteredPayments.length === 0 ? (
              <div className="p-8 text-center text-slate-600">
                No payments found.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700">
                <thead className="bg-slate-100 text-slate-800">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">
                      Payment ID
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Amount ($)
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Method
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Paid At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {fileteredPayments.map((payment) => (
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

      {/* Payment Details Modal */}
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

            <h2 className="text-xl font-semibold mb-4 text-slate-800">
              Payment Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
              <div>
                <strong>Payment ID:</strong> {selectedPayment.payment_id}
              </div>
              <div>
                <strong>Order ID:</strong> {selectedPayment.order_id}
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
                <strong>Status:</strong>
                <span
                  className={`ml-2 ${formatStatus(
                    selectedPayment.payment_status
                  )}`}
                >
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
