import { useState, useEffect } from "react";
import {
  Check,
  FileText,
  Book,
  DollarSign,
  Layers,
  Hash,
  Globe,
  User,
  Calendar,
  CreditCard,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import Visa from "../../assets/visa.png";
import PayPal from "../../assets/paypal.png";
import { endpoint } from "../../server";
import axios from "axios";
import { notify } from "../../utils/toast";

function ClassPayment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState([
    {
      number: 1,
      title: "Class Order Instructions",
      current: false,
      completed: true,
    },
    {
      number: 2,
      title: "Class Payment",
      current: true,
      completed: false,
    },
  ]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [classData, setClassData] = useState({
    subject: "",
    course_code: "",
    academic_level: "undergraduate",
    week_range: "",
    budget: "",
    login_url: "",
    login_username: "",
    notes: "",
    uploadedSyllabus: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("classStep1Data");
    if (stored) {
      setClassData(JSON.parse(stored));
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
        case "paypal": {
          const step1 = JSON.parse(
            localStorage.getItem("classStep1Data") || "{}"
          );
          const classHelpId = step1.class_help_id;

          if (!classHelpId) {
            throw new Error("No class_help_id found in localStorage");
          }

          response = await axios.post(
            `${endpoint}/checkout/class/orders/pay-with-paypal`,
            { classHelpId },
            { withCredentials: true }
          );

          redirectUrl = response.data.approvalUrl;
          if (!redirectUrl) throw new Error("No approval URL received");
          break;
        }

        case "visa": {
          response = await axios.post(
            `${endpoint}/checkout/class/stripe`,
            {},
            { withCredentials: true }
          );
          redirectUrl = response.data.sessionUrl;
          if (!redirectUrl) throw new Error("No session URL received");
          break;
        }

        default:
          throw new Error("Please select a payment method");
      }

      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Payment error:", error);
      try {
        const step1 = JSON.parse(
          localStorage.getItem("classStep1Data") || "{}"
        );
        const orderData = {
          ...step1,
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

  // Enhanced Payment Method Card
  const PaymentMethodCard = ({
    value,
    label,
    logo,
    selected,
    onClick,
    description,
  }) => {
    return (
      <div
        onClick={onClick}
        className={`relative cursor-pointer p-6 transition-all duration-300 rounded-2xl border-2 group hover:shadow-lg ${
          selected
            ? "border-teal-500 bg-gradient-to-br from-teal-50 to-teal-100 shadow-md"
            : "border-slate-200 bg-white hover:border-teal-300 hover:bg-gradient-to-br hover:from-teal-50 hover:to-white"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                selected
                  ? "bg-teal-500"
                  : "bg-slate-100 group-hover:bg-teal-100"
              } transition-colors`}
            >
              <CreditCard
                className={`w-5 h-5 ${
                  selected
                    ? "text-white"
                    : "text-slate-600 group-hover:text-teal-600"
                }`}
              />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">{label}</h3>
              <p className="text-sm text-slate-500">{description}</p>
            </div>
          </div>
          {logo && (
            <img
              src={logo}
              alt={label}
              className="h-8 w-auto max-w-[80px] object-contain"
            />
          )}
        </div>

        {selected && (
          <div className="absolute top-4 right-4 bg-teal-500 rounded-full p-1">
            <Check className="text-white w-4 h-4" />
          </div>
        )}

        <div
          className={`w-full h-1 rounded-full mt-4 ${
            selected ? "bg-teal-500" : "bg-slate-200"
          } transition-colors`}
        ></div>
      </div>
    );
  };

  // Skeleton loader for summary
  const SkeletonLoader = () => (
    <div className="space-y-6 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-slate-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 rounded-lg" />
            <div className="flex-1">
              <div className="h-4 bg-slate-200 rounded w-1/3 mb-2" />
              <div className="h-5 bg-slate-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const handlePrevious = () => {
    navigate("/class-help");
  };

  const summaryItems = [
    {
      icon: Book,
      label: "Subject",
      value: classData.subject,
      color: "text-blue-600 bg-blue-100",
    },
    {
      icon: Hash,
      label: "Course Code",
      value: classData.course_code,
      color: "text-purple-600 bg-purple-100",
    },
    {
      icon: Layers,
      label: "Academic Level",
      value: classData.academic_level,
      color: "text-green-600 bg-green-100",
      transform: "capitalize",
    },
    {
      icon: Calendar,
      label: "Duration",
      value: classData.week_range,
      color: "text-orange-600 bg-orange-100",
    },
    {
      icon: Globe,
      label: "Learning Platform",
      value: classData.login_url
        ? new URL(classData.login_url).hostname
        : "N/A",
      color: "text-indigo-600 bg-indigo-100",
    },
    {
      icon: User,
      label: "Username",
      value: classData.login_username,
      color: "text-pink-600 bg-pink-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-teal-100 to-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <Navbar />

      <main className="pt-16 relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-8 mt-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Complete Your Order
            </h1>
            <p className="text-slate-600">
              Review your class details and choose your payment method
            </p>
          </div>

          {/* Progress Tracker */}
          <div className="p-4 sm:p-6 mb-4 mt-4">
            <div className="flex flex-wrap gap-4 items-center justify-center sm:justify-between">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="relative z-10 flex items-center"
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

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: Order Summary - Takes 3 columns */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <FileText className="w-6 h-6 text-slate-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Order Summary
                  </h2>
                </div>

                {classData.subject ? (
                  <div className="space-y-4">
                    {summaryItems
                      .filter((item) => item.value && item.value !== "N/A")
                      .map((item, index) => (
                        <div
                          key={index}
                          className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${item.color}`}>
                              <item.icon size={20} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-600 mb-1">
                                {item.label}
                              </p>
                              <p
                                className={`text-lg font-semibold text-slate-800 ${
                                  item.transform || ""
                                }`}
                              >
                                {item.value}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                    {classData.notes && (
                      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
                            <FileText size={20} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-amber-700 mb-2">
                              Additional Notes
                            </p>
                            <p className="text-amber-800 text-sm leading-relaxed">
                              {classData.notes}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Total Amount Card */}
                    <div className="bg-gradient-to-r from-teal-500 to-teal-700 rounded-xl p-6 text-white mt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <DollarSign size={24} />
                          <div>
                            <p className="text-teal-100 text-sm">
                              Total Amount
                            </p>
                            <p className="text-2xl font-bold">
                              ${parseFloat(classData.budget || 0).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <ShieldCheck size={32} className="text-teal-200" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <SkeletonLoader />
                )}
              </div>
            </div>

            {/* Right: Payment Methods - Takes 2 columns */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 h-fit sticky top-24">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <CreditCard className="w-6 h-6 text-slate-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Payment Method
                  </h2>
                </div>

                <div className="space-y-4 mb-8">
                  <PaymentMethodCard
                    value="paypal"
                    label="PayPal"
                    description="Pay securely with PayPal"
                    logo={PayPal}
                    selected={selectedMethod === "paypal"}
                    onClick={() => handleSelect("paypal")}
                  />
                  <PaymentMethodCard
                    value="visa"
                    label="Credit/Debit Card"
                    description="Visa, MasterCard, and more"
                    logo={Visa}
                    selected={selectedMethod === "visa"}
                    onClick={() => handleSelect("visa")}
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedMethod || isSubmitting}
                    className={`w-full py-4 rounded-xl text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                      selectedMethod && !isSubmitting
                        ? "bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 hover:shadow-lg transform hover:scale-[1.02]"
                        : "bg-slate-300 cursor-not-allowed"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
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
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={20} />
                        Complete Payment
                      </>
                    )}
                  </button>

                  <button
                    onClick={handlePrevious}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-md cursor-pointer"
                  >
                    <ArrowLeft size={18} />
                    Back to Order Details
                  </button>
                </div>

                {/* Security Note */}
                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <ShieldCheck size={16} className="text-green-600" />
                    <span>
                      Your payment information is encrypted and secure
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ClassPayment;
