import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PaypalImage from "../../assets/paypal.png";
import axios from "axios";
import { notify } from "../../utils/toast";
import { backend } from "../../backend";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import { Link } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { fetchProfile } from "../../utils/profile";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [emailData, setEmailData] = useState({
    paypalEmail: "",
  });
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [requestHistory, setRequestHistory] = useState([]);
  const [availableFunds, setAvailableFunds] = useState(0);
  const [withdrawing, setWithdrawing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [existingPaypalEmail, setExistingPaypalEmail] = useState(""); // Holds saved email
  const [addingEmail, setAddingEmail] = useState(false);

  // Fetch All Payouts
  useEffect(() => {
    const fetchPayouts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${backend}/payout/payouts`, {
          withCredentials: true,
        });
        setPayments(response.data);

        // ✅ Calculate available funds here as well
        const total = response.data
          .filter(
            (p) =>
              p.status === "pending" && p.matured_at <= new Date().toISOString()
          )
          .reduce((sum, p) => sum + parseFloat(p.amount), 0);
        setAvailableFunds(total);
      } catch (error) {
        notify.error("Failed to fetch payouts");
        console.error("Error fetching payouts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "all") {
      fetchPayouts();
    }
  }, [activeTab]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchProfile();
        if (profile?.paypal_email) {
          setExistingPaypalEmail(profile.paypal_email);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    loadProfile();
  }, []);

  // Fetch Available (Matured) Payouts and Calculate Total
  useEffect(() => {
    const fetchMaturedPayouts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${backend}/payout/payouts/available`,
          {
            withCredentials: true,
          }
        );
        setPayments(response.data);

        // ✅ Still calculate here for consistency
        const total = response.data
          .filter(
            (p) =>
              p.status === "pending" && p.matured_at <= new Date().toISOString()
          )
          .reduce((sum, p) => sum + parseFloat(p.amount), 0);
        setAvailableFunds(total);
      } catch (error) {
        notify.error("Failed to fetch available payouts");
        console.error("Error fetching available payouts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "available") {
      fetchMaturedPayouts();
    }
  }, [activeTab]);

  // Fetch Request History
  useEffect(() => {
    const fetchRequestHistory = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${backend}/payout/payouts/recent`, {
          withCredentials: true,
        });
        setRequestHistory(response.data);
      } catch (error) {
        notify.error("Failed to fetch request history");
        console.error("Error fetching request history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "history") {
      fetchRequestHistory();
    }
  }, [activeTab]);

  // Handle Payout Request
  const handleRequestPayout = async () => {
    if (availableFunds <= 0) {
      notify.error("No funds available for withdrawal");
      return;
    }
    setWithdrawing(true);
    try {
      const response = await axios.post(
        `${backend}/payout/payouts/release-funds`,
        {},
        { withCredentials: true }
      );
      notify.success(response.data.message);
      // Refresh available payouts and funds
      const refreshedPayouts = await axios.get(
        `${backend}/payout/payouts/available`,
        { withCredentials: true }
      );
      setPayments(refreshedPayouts.data);
      const total = refreshedPayouts.data
        .filter(
          (p) =>
            p.status === "pending" && p.matured_at <= new Date().toISOString()
        )
        .reduce((sum, p) => sum + parseFloat(p.amount), 0);
      setAvailableFunds(total);
    } catch (error) {
      notify.error(
        error.response?.data?.message || "Failed to process payout request"
      );
      console.error("Error processing payout:", error);
    } finally {
      setWithdrawing(false);
    }
  };

  //Handle Add Payout Account
  const handleAddPayoutAccount = async () => {
    if (!paypalEmail) {
      notify.error("Please enter a PayPal email");
      return;
    }
    setAddingEmail(true);
    try {
      const response = await axios.post(
        `${backend}/payout/payouts/add/payout-account`,
        { paypalEmail: paypalEmail },
        { withCredentials: true }
      );

      notify.success(response.data.message);
      setExistingPaypalEmail(response.data.writer.paypal_email);
      setPaypalEmail("");
      setShowAddModal(false);
    } catch (error) {
      notify.error(
        error.response?.data?.message || "Failed to add PayPal account"
      );
      console.error(error);
    } finally {
      setAddingEmail(false);
    }
  };

  const formatStatus = (status) => {
    const baseClass =
      "inline-block px-2 py-1 rounded-full text-xs font-medium capitalize";
    switch (status) {
      case "pending":
        return `${baseClass} bg-blue-100 text-blue-800`;
      case "withdrawn":
        return `${baseClass} bg-green-100 text-green-800`;
      case "failed":
        return `${baseClass} bg-red-100 text-red-800`;
      default:
        return `${baseClass} bg-slate-200 text-slate-600`;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const renderContent = () => {
    if (loading) return <Spinner />;

    switch (activeTab) {
      case "all":
      case "available":
        if (payments.length === 0) {
          return (
            <div className="bg-white p-6 rounded-lg text-center text-slate-600">
              Payout not found
            </div>
          );
        }
        return (
          <ul className="space-y-4">
            {payments.map((payment) => (
              <li
                key={payment.payout_id}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedPayment(payment)}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 text-sm sm:text-base">
                      Payout ID: {payment.payout_id}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Order ID: {payment.order_id}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Created: {formatDate(payment.created_at)}
                    </p>
                  </div>
                  <div className="flex justify-between sm:text-right sm:block">
                    <div>
                      <p className="font-medium text-slate-900 text-sm sm:text-base">
                        ${parseFloat(payment.amount).toFixed(2)}
                      </p>
                      <p className={formatStatus(payment.status)}>
                        {payment.status}
                      </p>
                    </div>
                    <div className="sm:mt-1">
                      <p className="text-xs sm:text-sm text-slate-600">
                        Maturity: {formatDate(payment.matured_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        );

      case "history":
        if (requestHistory.length === 0) {
          return (
            <div className="bg-white p-6 rounded-lg text-center text-slate-600">
              Payout not found
            </div>
          );
        }
        return (
          <ul className="space-y-4">
            {requestHistory.map((request) => (
              <li
                key={request.payout_id}
                className="bg-white p-4 rounded-lg shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 text-sm sm:text-base">
                      Payout ID: {request.payout_id}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Withdrawn: {formatDate(request.withdrawn_at)}
                    </p>
                  </div>
                  <div className="flex justify-between sm:text-right sm:block">
                    <p className="font-medium text-slate-900 text-sm sm:text-base">
                      ${parseFloat(request.amount).toFixed(2)}
                    </p>
                    <p className={formatStatus(request.status)}>
                      {request.status}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        );

      case "accounts":
        return (
          <div>
            {existingPaypalEmail ? (
              <div className="bg-white p-4 shadow-sm rounded-lg flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <img
                  src={PaypalImage}
                  alt="PayPal"
                  className="w-12 h-12 sm:w-16 sm:h-16"
                />
                <p className="text-slate-700 font-medium text-center sm:text-left break-all">
                  {existingPaypalEmail}
                </p>
              </div>
            ) : (
              <div className="text-center bg-white p-6 rounded-lg shadow-sm">
                <p className="text-slate-600">No payment accounts added.</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Payment Account
                </button>
              </div>
            )}

            {/* Add PayPal Modal */}
            {showAddModal && (
              <Dialog
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"
              >
                <div className="bg-white rounded-xl w-full max-w-sm mx-4 p-6 relative">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"
                  >
                    <X />
                  </button>
                  <h2 className="text-lg font-semibold mb-4 text-slate-800">
                    Add PayPal Account
                  </h2>
                  <input
                    type="email"
                    placeholder="Enter your PayPal email"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                  <button
                    onClick={handleAddPayoutAccount}
                    disabled={addingEmail}
                    className={`w-full px-4 py-2 rounded-lg text-white font-medium cursor-pointer ${
                      addingEmail
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {addingEmail ? "Adding..." : "Add Account"}
                  </button>
                </div>
              </Dialog>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 pt-16 sm:pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 mb-4 mt-4 sm:mt-8">
            Payments
          </h1>

          {/* Withdrawal Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-lg shadow-sm mb-6 space-y-3 sm:space-y-0">
            <p className="text-xs sm:text-sm text-slate-700 text-center sm:text-left">
              Available funds for withdrawal:{" "}
              <span className="font-semibold">
                ${availableFunds.toFixed(2)}
              </span>
            </p>
            <button
              onClick={handleRequestPayout}
              disabled={withdrawing || availableFunds <= 0}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-white cursor-pointer w-full sm:w-auto ${
                withdrawing || availableFunds <= 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {withdrawing ? "Processing..." : "Request Payout"}
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-200 mb-6 overflow-x-auto">
            <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max">
              {["all", "available", "history", "accounts"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${
                    activeTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-xs sm:text-sm capitalize flex-shrink-0`}
                >
                  {tab
                    .replace("all", "All Payouts")
                    .replace("available", "Available Payouts")
                    .replace("history", "Request History")
                    .replace("accounts", "My Payment Accounts")}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="mt-6">{renderContent()}</div>
        </div>
      </main>

      {/* Payment Modal */}
      {selectedPayment && (
        <Dialog
          open={!!selectedPayment}
          onClose={() => setSelectedPayment(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/30 backdrop-blur-sm"
        >
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedPayment(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"
            >
              <X className="hover:text-red-600" />
            </button>

            <h2 className="text-base sm:text-lg font-semibold mb-4 text-slate-800 pr-8">
              Payout Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-slate-700">
              <div className="break-all">
                <strong>Payout ID:</strong> {selectedPayment.payout_id}
              </div>
              <div className="break-all">
                <strong>Order ID:</strong>{" "}
                <Link
                  to={`/order-details/${selectedPayment.order_id}`}
                  className="text-blue-600 hover:underline"
                >
                  {selectedPayment.order_id}
                </Link>
              </div>
              <div className="break-all">
                <strong>Writer ID:</strong> {selectedPayment.writer_id}
              </div>
              <div>
                <strong>Amount:</strong> $
                {parseFloat(selectedPayment.amount).toFixed(2)}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <span className={formatStatus(selectedPayment.status)}>
                  {selectedPayment.status}
                </span>
              </div>
              <div>
                <strong>Matured At:</strong>{" "}
                {formatDate(selectedPayment.matured_at)}
              </div>
              <div>
                <strong>Withdrawn At:</strong>{" "}
                {formatDate(selectedPayment.withdrawn_at)}
              </div>
              <div className="break-all">
                <strong>Transaction ID:</strong>{" "}
                {selectedPayment.paypal_transaction_id || "N/A"}
              </div>
              <div className="sm:col-span-2">
                <strong>Created At:</strong>{" "}
                {formatDate(selectedPayment.created_at)}
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
