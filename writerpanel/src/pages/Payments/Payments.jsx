import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";
import { notify } from "../../utils/toast";
import { backend } from "../../backend";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
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
      <Navbar />
      <main className="flex-1 pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-base sm:text-lg font-semibold text-slate-900 mb-6 mt-8">
            Payments
          </h1>
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
