import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { notify } from "../../utils/toast";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { CheckCircle } from "lucide-react";
import { endpoint } from "../../server";
import PayPal from "../../assets/paypal.png";
import StripeLogo from "../../assets/stripe.png";

function Success() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(true);
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const maxPollingAttempts = 5;
  const pollingInterval = 2000;

  const formatDate = (dateString) => {
    const options = {
      month: "long",
      weekday: "short",
      day: "numeric",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const fetchPayments = async (orderId = null) => {
    try {
      const response = await axios.get(`${endpoint}/payments/all/my-payments`, {
        withCredentials: true,
      });
      setPayments(response.data);

      if (orderId) {
        const payment = response.data.find((p) => p.order_id === orderId);
        if (payment) {
          setLoading(false);
          notify.success("Payment confirmed!");
        } else if (pollingAttempts < maxPollingAttempts) {
          setPollingAttempts((prev) => prev + 1);
        } else {
          setLoading(false);
          notify.warn("Payment is being processed. Please check back later.");
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      if (pollingAttempts >= maxPollingAttempts) {
        setLoading(false);
        notify.error("Failed to fetch payments. Please try again later.");
      } else {
        setPollingAttempts((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    const token = searchParams.get("token");

    const captureAndFetchPayments = async () => {
      if (!token) {
        fetchPayments();
        return;
      }

      try {
        const captureResponse = await axios.post(
          `${endpoint}/payments/capture`,
          { token },
          { withCredentials: true }
        );
        notify.success("Payment captured successfully.");

        localStorage.removeItem("step1Data");
        localStorage.removeItem("step2Data");
        localStorage.removeItem("checkoutAmount");
        localStorage.removeItem("order_id");
        localStorage.removeItem("orderData");

        const orderId =
          captureResponse.data.capture.purchase_units[0]?.custom_id;
        if (orderId) {
          fetchPayments(orderId);
          if (pollingAttempts < maxPollingAttempts) {
            const interval = setInterval(() => {
              fetchPayments(orderId);
            }, pollingInterval);
            return () => clearInterval(interval);
          }
        } else {
          fetchPayments();
        }
      } catch (error) {
        console.error("Capture failed:", error);
        notify.error("Failed to capture PayPal payment.");
        setLoading(false);
      }
    };

    captureAndFetchPayments();
  }, [pollingAttempts]);

  return (
    <div className="min-h-screen  flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />

      <main className="flex-1 transition-all duration-300 pt-34 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {showSuccessMessage && !loading && (
            <div className="border bg-green-100 border-green-300 text-green-800 rounded-lg flex items-center gap-3 px-6 py-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h2 className="font-semibold text-lg">Payment Successful!</h2>
                <p>Your payment has been processed. Thank you!</p>
              </div>
              <button
                className="ml-auto text-sm text-green-700 hover:underline cursor-pointer"
                onClick={() => setShowSuccessMessage(false)}
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="bg-white shadow rounded-xl p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-slate-700 mb-4">
              Your Recent Payments
            </h3>

            {loading ? (
              <p className="text-gray-500">Checking for payments...</p>
            ) : payments.length === 0 ? (
              <p className="text-gray-500">
                No payments found. If your payment is still processing, please
                check back later.
              </p>
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
                        Type
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">
                        Method
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">
                        Reference
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {payments.map((payment, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 text-blue-600 hover:underline">
                          <Link to={`/order-details/${payment.order_id}`}>
                            {payment.order_id}
                          </Link>
                        </td>
                        <td className="px-4 py-2">${payment.amount}</td>
                        <td className="px-4 py-2 capitalize">
                          {payment.payment_type}
                        </td>
                        <td className="px-4 py-2">
                          {payment.payment_method === "Stripe" ? (
                            <img
                              src={StripeLogo}
                              alt="Stripe"
                              className="w-12"
                            />
                          ) : (
                            <img src={PayPal} alt="PayPal" className="w-12" />
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
                              payment.payment_status?.toLowerCase() ===
                              "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {payment.payment_status}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {payment.transaction_reference || "—"}
                        </td>
                        <td className="px-4 py-2">
                          {formatDate(payment.created_at)}
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
      <Footer/>
    </div>
  );
}

export default Success;
