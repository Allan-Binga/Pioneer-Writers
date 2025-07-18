import { useState, useEffect } from "react";
import {
  Check,
  FileText,
  Calendar,
  Book,
  DollarSign,
  Layers,
  Hash,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import Visa from "../../assets/visa.png";
import PayPal from "../../assets/paypal.png";
import StripeLogo from "../../assets/stripe.png";
import { endpoint } from "../../server";
import axios from "axios";
import { notify } from "../../utils/toast";

function OrderPayment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [steps] = useState([
    {
      number: 1,
      title: "Assignment Instructions",
      current: false,
      completed: true,
    },
    { number: 2, title: "Order Confirmation", current: false, completed: true },
    {
      number: 3,
      title: "Order Confirmation",
      current: true,
      completed: false,
    },
  ]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [orderData, setOrderData] = useState({
    topic: "",
    document_type: "",
    writer_level: "",
    pages: "",
    deadline: "",
    writer_type: "",
    topic_field: "",
    type_of_service: "",
    paper_format: "",
    spacing: "",
    english_type: "",
    number_of_words: 0,
    number_of_sources: 0,
    instructions: "",
    uploadedFiles: [], // For display only
    writer_tip: "",
    plagiarism_report: false,
    payment_option: "full",
    coupon_code: "",
    total_price: 0,
    initial_total_price: 0,
    checkout_amount: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("step2Data");
    if (stored) {
      setOrderData(JSON.parse(stored));
    }
  }, []);

  const handleSelect = (method) => {
    setSelectedMethod(method);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoading(true);

    try {
      let response;
      let redirectUrl;

      switch (selectedMethod) {
        case "googlepay":
          response = await axios.post(
            `${endpoint}/checkout/google`,
            {},
            { withCredentials: true }
          );
          redirectUrl = response.data.sessionUrl;
          if (!redirectUrl) throw new Error("No session URL received");
          break;

        case "paypal":
          response = await axios.post(
            `${endpoint}/checkout/pay-with-paypal`,
            {},
            { withCredentials: true }
          );
          redirectUrl = response.data.approvalUrl;
          if (!redirectUrl) throw new Error("No approval URL received");
          break;

        case "stripe":
        case "visa": // Reuse same logic for visa
          response = await axios.post(
            `${endpoint}/checkout/stripe`,
            {},
            { withCredentials: true }
          );
          redirectUrl = response.data.sessionUrl;
          if (!redirectUrl) throw new Error("No session URL received");
          break;

        default:
          throw new Error("Please select a payment method");
      }

      // ✅ Clear all related storage on success
      localStorage.removeItem("step1Data");
      localStorage.removeItem("step2Data");
      localStorage.removeItem("checkoutAmount");
      localStorage.removeItem("order_id");
      localStorage.removeItem("orderData");

      // 🔁 Redirect to payment gateway
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Payment error:", error);

      // ✅ Combine step1 and step2 data for recovery
      try {
        const step1 = JSON.parse(localStorage.getItem("step1Data") || "{}");
        const step2 = JSON.parse(localStorage.getItem("step2Data") || "{}");

        const orderData = {
          ...step1,
          ...step2,
          selectedMethod,
          timestamp: new Date().toISOString(), // Optional: for tracking
        };

        localStorage.setItem("orderData", JSON.stringify(orderData));
      } catch (storageErr) {
        console.warn("Failed to save orderData to localStorage", storageErr);
      }

      notify.error(`Failed to initiate ${selectedMethod} payment`);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(isoDate));
  };

  // Custom radio component for payment methods
  const CustomRadio = ({ label, value, logo }) => (
    <div
      onClick={() => handleSelect(value)}
      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
        selectedMethod === value
          ? "border-slate-500 bg-slate-50 shadow-md ring-1 ring-slate-200"
          : "border-gray-200 hover:border-slate-300 hover:bg-slate-50/50"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
            selectedMethod === value
              ? "border-slate-500 bg-slate-500"
              : "border-gray-300"
          }`}
        >
          {selectedMethod === value && (
            <div className="w-2.5 h-2.5 rounded-full bg-white" />
          )}
        </div>
        <span className="text-md font-medium text-gray-700">{label}</span>
      </div>
      <img
        src={logo}
        alt={label}
        className="h-8 w-auto max-w-[120px] object-contain"
      />
    </div>
  );

  // Skeleton loader for summary
  const SkeletonLoader = () => (
    <div className="space-y-3 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      ))}
    </div>
  );

  const handlePrevious = () => {
    navigate("/order-confirmation");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <Navbar />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Progress Tracker */}
          <div className="p-6 mb-8">
            <div className="flex items-center justify-between relative">
              {/* Steps */}
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="relative z-10 flex items-center"
                >
                  <div
                    className={`flex items-center px-8 py-4 rounded-full border text-sm font-medium transition-all duration-300 ${
                      step.completed
                        ? "bg-gradient-to-r from-slate-600 to-slate-800 border-slate-700 text-white"
                        : step.current
                        ? "bg-gradient-to-r from-slate-600 to-slate-800 border-slate-700 text-white shadow-md"
                        : "bg-white border-slate-300 text-slate-400"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${
                        step.completed || step.current
                          ? "bg-white text-slate-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {step.completed ? <Check size={12} /> : step.number}
                    </span>
                    {step.title}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Order Summary */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 transition-all duration-300 hover:shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-slate-500 to-slate-500" />
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileText size={20} className="text-slate-500" />
                Order Summary
              </h2>
              {orderData ? (
                <div className="space-y-4 text-gray-600">
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                    <Book size={18} className="text-slate-400" />
                    <div className="flex-1">
                      <span className="text-md font-medium text-gray-500">
                        Topic
                      </span>
                      <p className="text-base font-semibold text-gray-800">
                        {orderData.topic || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                    <Layers size={18} className="text-slate-400" />
                    <div className="flex-1">
                      <span className="text-md font-medium text-gray-500">
                        Service
                      </span>
                      <p className="text-base font-semibold text-gray-800 capitalize">
                        {orderData.type_of_service || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                    <FileText size={18} className="text-slate-400" />
                    <div className="flex-1">
                      <span className="text-md font-medium text-gray-500">
                        Document Type
                      </span>
                      <p className="text-base font-semibold text-gray-800 capitalize">
                        {orderData.document_type || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                    <Book size={18} className="text-slate-400" />
                    <div className="flex-1">
                      <span className="text-md font-medium text-gray-500">
                        Writer Level
                      </span>
                      <p className="text-base font-semibold text-gray-800 capitalize">
                        {orderData.writer_level || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                    <Hash size={18} className="text-slate-400" />
                    <div className="flex-1">
                      <span className="text-md font-medium text-gray-500">
                        Pages
                      </span>
                      <p className="text-base font-semibold text-gray-800">
                        {orderData.pages || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                    <Calendar size={18} className="text-slate-400" />
                    <div className="flex-1">
                      <span className="text-md font-medium text-gray-500">
                        Deadline
                      </span>
                      <p className="text-base font-semibold text-gray-800">
                        {formatDate(orderData.deadline)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                    <DollarSign size={18} className="text-slate-400" />
                    <div className="flex-1">
                      <span className="text-md font-medium text-gray-500">
                        Total Price
                      </span>
                      <p className="text-base font-semibold text-gray-800">
                        ${orderData.total_price?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-slate-400" />
                    <div className="flex-1">
                      <span className="text-md font-medium text-gray-500">
                        Plagiarism Report
                      </span>
                      <p className="text-base font-semibold text-gray-800">
                        {orderData.plagiarism_report
                          ? "Included"
                          : "Not Included"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <SkeletonLoader />
              )}
            </div>

            {/* Right: Payment Options */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  Choose Payment Method
                </h2>
                <div className="space-y-4">
                  <CustomRadio label="PayPal" value="paypal" logo={PayPal} />
                  <CustomRadio label="Visa" value="visa" logo={Visa} />
                  {/* <CustomRadio
                    label="Google Pay"
                    value="googlepay"
                    logo={Googlepay}
                  /> */}
                  <CustomRadio
                    label="Stripe"
                    value="stripe"
                    logo={StripeLogo}
                  />
                </div>
              </div>
              <div className="mt-6">
                <div className="flex justify-between text-lg font-semibold text-gray-800 mb-4">
                  <span>Checkout Amount</span>
                  <span>
                    ${orderData?.checkout_amount?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <button
                    onClick={handlePrevious}
                    className="w-1/2 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow cursor-pointer"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedMethod || isSubmitting}
                    className={`w-1/2 py-3 rounded-xl text-white font-semibold transition-all duration-300 cursor-pointer ${
                      selectedMethod && !isSubmitting
                        ? "bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 hover:shadow-lg"
                        : "bg-gray-300 cursor-not-allowed"
                    } flex items-center justify-center`}
                  >
                    {isSubmitting ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                    ) : null}
                    {isSubmitting ? "Processing..." : "Proceed to Checkout"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrderPayment;
