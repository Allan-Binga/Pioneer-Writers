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
    { number: 3, title: "Order Payment", current: true, completed: false },
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
    uploadedFiles: [],
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
        case "paypal":
          const orderId = localStorage.getItem("order_id");

          if (!orderId) {
            throw new Error("No order ID found in localStorage");
          }

          response = await axios.post(
            `${endpoint}/checkout/pay-with-paypal`,
            { orderId },
            { withCredentials: true }
          );

          redirectUrl = response.data.approvalUrl;
          if (!redirectUrl) throw new Error("No approval URL received");
          break;

        case "visa":
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

      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Payment error:", error);
      try {
        const step1 = JSON.parse(localStorage.getItem("step1Data") || "{}");
        const step2 = JSON.parse(localStorage.getItem("step2Data") || "{}");
        const orderData = {
          ...step1,
          ...step2,
          selectedMethod,
          timestamp: new Date().toISOString(),
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

  const formatDate = (isoDate) =>
    isoDate
      ? new Intl.DateTimeFormat("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(isoDate))
      : "N/A";

  // OptionCard component (reused from NewOrder)
  const OptionCard = ({ value, label, logo, selected, onClick }) => {
    return (
      <div
        onClick={onClick}
        className={`relative cursor-pointer p-4 transition duration-200 bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 rounded-lg shadow-sm border ${
          selected ? "border-teal-500 bg-teal-50" : "border-slate-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-700">{label}</div>
          {logo && (
            <img
              src={logo}
              alt={label}
              className="h-6 w-auto max-w-[100px] object-contain"
            />
          )}
        </div>
        {selected && (
          <Check className="absolute top-3 right-3 text-teal-500 w-5 h-5" />
        )}
      </div>
    );
  };

  // Skeleton loader for summary
  const SkeletonLoader = () => (
    <div className="space-y-4 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-5 h-5 bg-slate-200 rounded-full" />
          <div className="h-4 bg-slate-200 rounded w-3/4" />
        </div>
      ))}
    </div>
  );

  const handlePrevious = () => {
    navigate("/order-confirmation");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative">
      {/* Animated Background Waves - Fixed z-index */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
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

      <main className="pt-16 relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Progress Tracker */}
          <div className="p-4 sm:p-6 mb-4 mt-4 relative z-20">
            <div className="flex flex-wrap gap-4 items-center justify-center sm:justify-between">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="relative z-30 flex items-center"
                >
                  <div
                    className={`flex items-center px-4 sm:px-6 py-3 rounded-full border text-sm font-medium transition-all duration-300 ${
                      step.completed
                        ? "bg-gradient-to-r from-teal-500 to-teal-700 border-teal-600 text-white"
                        : step.current
                        ? "bg-gradient-to-r from-teal-500 to-teal-700 border-teal-600 text-white shadow-md"
                        : "bg-white border-slate-200 text-slate-400"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${
                        step.completed || step.current
                          ? "bg-white text-teal-700"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-20">
            {/* Left: Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 relative z-30 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <FileText size={20} className="text-slate-500" />
                Order Summary
              </h2>
              {orderData ? (
                <div className="space-y-4 text-slate-600 text-sm">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <Book size={18} className="text-slate-400" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-slate-600">
                        Topic
                      </span>
                      <p className="text-base font-semibold text-slate-800">
                        {orderData.topic || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <Layers size={18} className="text-slate-400" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-slate-600">
                        Service
                      </span>
                      <p className="text-base font-semibold text-slate-800 capitalize">
                        {orderData.type_of_service || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <FileText size={18} className="text-slate-400" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-slate-600">
                        Document Type
                      </span>
                      <p className="text-base font-semibold text-slate-800 capitalize">
                        {orderData.document_type || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <Book size={18} className="text-slate-400" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-slate-600">
                        Writer Level
                      </span>
                      <p className="text-base font-semibold text-slate-800 capitalize">
                        {orderData.writer_level || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <Hash size={18} className="text-slate-400" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-slate-600">
                        Pages
                      </span>
                      <p className="text-base font-semibold text-slate-800">
                        {orderData.pages || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <Calendar size={18} className="text-slate-400" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-slate-600">
                        Deadline
                      </span>
                      <p className="text-base font-semibold text-slate-800">
                        {formatDate(orderData.deadline)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <DollarSign size={18} className="text-slate-400" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-slate-600">
                        Total Price
                      </span>
                      <p className="text-base font-semibold text-slate-800">
                        ${orderData.total_price?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-slate-400" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-slate-600">
                        Plagiarism Report
                      </span>
                      <p className="text-base font-semibold text-slate-800">
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
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between relative z-30 backdrop-blur-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  Choose Payment Method
                </h2>
                <div className="space-y-4">
                  {[
                    { value: "paypal", label: "PayPal", logo: PayPal },
                    { value: "visa", label: "Visa", logo: Visa },
                  ].map((method) => (
                    <OptionCard
                      key={method.value}
                      value={method.value}
                      label={method.label}
                      logo={method.logo}
                      selected={selectedMethod === method.value}
                      onClick={() => handleSelect(method.value)}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <div className="flex justify-between text-lg font-semibold text-slate-800 mb-4">
                  <span>Checkout Amount</span>
                  <span>
                    ${orderData?.checkout_amount?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <button
                    onClick={handlePrevious}
                    className="w-1/2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-3 rounded-xl cursor-pointer relative z-40"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedMethod || isSubmitting}
                    className={`w-1/2 py-3 rounded-xl text-white font-semibold transition-all duration-300 cursor-pointer relative z-40 ${
                      selectedMethod && !isSubmitting
                        ? "bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 hover:shadow-lg"
                        : "bg-slate-300 cursor-not-allowed"
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
