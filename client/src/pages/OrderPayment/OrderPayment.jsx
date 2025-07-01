import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { endpoint } from "../../server";
import { useNavigate, useLocation } from "react-router-dom";
import { notify } from "../../utils/toast";

function OrderPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [steps, setSteps] = useState([
    {
      number: 1,
      title: "Assignment Instructions",
      current: false,
      completed: true,
    },
    { number: 2, title: "Order Payment", current: true, completed: false },
    {
      number: 3,
      title: "Order Confirmation",
      current: false,
      completed: false,
    },
  ]);
  const [formData, setFormData] = useState({
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
  const [error, setError] = useState(null);

  const CustomRadio = ({ label, name, value, checked, onChange }) => {
    return (
      <label
        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
          checked
            ? "border-purple-500 bg-purple-50 shadow-sm"
            : "border-gray-200 hover:border-purple-400 hover:bg-purple-50/50"
        }`}
      >
        <span
          className={`relative w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
            checked ? "border-purple-500 bg-purple-500" : "border-gray-300"
          }`}
        >
          {checked && (
            <span className="absolute w-2.5 h-2.5 rounded-full bg-white" />
          )}
        </span>
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="hidden"
        />
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </label>
    );
  };

  useEffect(() => {
    // console.log("OrderPayment mounted. location.state:", location.state); // Debug
    const storedOrder = JSON.parse(localStorage.getItem("step1Data")) || {};
    setFormData((prev) => ({
      ...prev,
      topic: storedOrder.topic || "",
      document_type: storedOrder.document_type || "",
      writer_level: storedOrder.writer_level || "",
      pages: storedOrder.pages || "",
      deadline: storedOrder.deadline || "",
      writer_type: storedOrder.writer_type || "",
      topic_field: storedOrder.topic_field || "",
      type_of_service: storedOrder.type_of_service || "",
      paper_format: storedOrder.paper_format || "",
      spacing: storedOrder.spacing || "",
      english_type: storedOrder.english_type || "",
      number_of_words: storedOrder.number_of_words || 0,
      number_of_sources: storedOrder.number_of_sources || 0,
      instructions: storedOrder.instructions || "",
      uploadedFiles: storedOrder.uploadedFiles || [],
      writer_tip: storedOrder.writer_tip || "",
      plagiarism_report: storedOrder.plagiarism_report || false,
      payment_option: storedOrder.payment_option || "full",
      coupon_code: storedOrder.coupon_code || "",
      total_price: storedOrder.total_price || 0,
      initial_total_price: storedOrder.total_price || 0,
      checkout_amount: (storedOrder.total_price || 0) * 1.06,
    }));
  }, [location.state, navigate]);

  useEffect(() => {
    const calculatePrice = () => {
      let total = parseFloat(formData.initial_total_price || 0);
      const tip = parseFloat(formData.writer_tip);
      if (!isNaN(tip) && tip >= 0) {
        total += tip;
      }
      if (formData.plagiarism_report) {
        total += 6;
      }
      const finalTotal = formData.payment_option === "half" ? total / 2 : total;
      const checkoutAmount = finalTotal * 1.06;

      setFormData((prev) => ({
        ...prev,
        total_price: finalTotal,
        checkout_amount: checkoutAmount,
      }));
    };
    calculatePrice();
  }, [
    formData.initial_total_price,
    formData.writer_tip,
    formData.plagiarism_report,
    formData.payment_option,
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "plagiarismReport" && {
        plagiarism_report: value === "yes",
      }),
      ...(name === "writer_tip" && { writer_tip: value }),
      ...(name === "paymentOption" && { payment_option: value }),
      ...(name === "couponCode" && { coupon_code: value }),
      ...(name === "writerType" && { writer_type: value }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const storedOrder =
        JSON.parse(localStorage.getItem("step1Data")) ||
        location.state?.order ||
        {};
      const files = location.state?.files || [];
      // console.log("Frontend files:", files); // Debug

      const orderData = {
        topic_field: storedOrder.topic_field || "",
        type_of_service: storedOrder.type_of_service || "writing",
        document_type: storedOrder.document_type || "essay",
        writer_level: storedOrder.writer_level || "university",
        paper_format: storedOrder.paper_format || "none",
        english_type: storedOrder.english_type || "us",
        pages: parseInt(storedOrder.pages) || 1,
        spacing: storedOrder.spacing || "double",
        number_of_words: parseInt(storedOrder.number_of_words) || 0,
        number_of_sources: parseInt(storedOrder.number_of_sources) || 0,
        topic: storedOrder.topic || "",
        instructions: storedOrder.instructions || "",
        writer_type: storedOrder.writer_type || "standard",
        deadline: storedOrder.deadline || new Date().toISOString(),
        total_price: parseFloat(formData.total_price) || 0,
        checkout_amount: parseFloat(formData.checkout_amount) || 0,
        writer_tip:
          formData.writer_tip === ""
            ? null
            : parseFloat(formData.writer_tip) || 0,
        plagiarism_report: Boolean(formData.plagiarism_report),
        payment_option: formData.payment_option || "full",
        coupon_code: formData.coupon_code || "",
      };

      // console.log("Payload sent to backend:", orderData);

      const payload = new FormData();
      Object.entries(orderData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          payload.append(key, value);
        }
      });

      files.forEach((file, index) => {
        // console.log("Appending file to FormData:", file.name); // Debug
        payload.append("uploadedFiles", file);
      });

      const response = await axios.post(
        `${endpoint}/orders/post-order`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      localStorage.setItem("checkoutAmount", formData.checkout_amount);
      notify.success("Order posted, awaiting payment.");
      localStorage.setItem("step2Data", JSON.stringify({ ...formData }));
      localStorage.removeItem("step1Data");
      localStorage.removeItem("step2Data");

      setSteps((prev) =>
        prev.map((step, index) =>
          index === 1
            ? { ...step, current: false, completed: true }
            : index === 2
            ? { ...step, current: true }
            : step
        )
      );

      navigate("/order-checkout");
    } catch (error) {
      console.error("Error submitting order:", error.response?.data || error);
      notify.error(
        "Failed to process order details: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    navigate("/new-order");
  };

  const formatDeadline = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <Navbar />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200 z-0">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                  style={{
                    width: `${
                      (steps.findIndex((s) => s.current) / (steps.length - 1)) *
                      100
                    }%`,
                  }}
                />
              </div>
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center relative z-10"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      step.completed
                        ? "bg-gradient-to-r from-purple-500 to-indigo-500 border-purple-500 text-white"
                        : step.current
                        ? "bg-gradient-to-r from-purple-500 to-indigo-500 border-purple-500 text-white shadow-lg"
                        : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    {step.completed ? (
                      <Check size={16} />
                    ) : (
                      <span className="text-sm font-semibold">
                        {step.number}
                      </span>
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium text-center ${
                      step.current ? "text-purple-600" : "text-gray-600"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-purple-200 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Step 2: Order Payment
                </h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <label
                    htmlFor="writer_tip"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Writer's Tip
                  </label>
                  <div className="relative">
                    <input
                      id="writer_tip"
                      name="writer_tip"
                      type="number"
                      value={formData.writer_tip}
                      onChange={handleChange}
                      placeholder="Add tip in USD"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors duration-200 bg-white placeholder-gray-400 text-gray-800 pr-10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Plagiarism Report
                    </label>
                    <div className="space-y-2">
                      <CustomRadio
                        label="Attach"
                        name="plagiarismReport"
                        value="yes"
                        checked={formData.plagiarism_report === true}
                        onChange={handleChange}
                      />
                      <CustomRadio
                        label="Do not attach"
                        name="plagiarismReport"
                        value="no"
                        checked={formData.plagiarism_report === false}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Payment Option <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      <CustomRadio
                        label="Pay in Full"
                        name="paymentOption"
                        value="full"
                        checked={formData.payment_option === "full"}
                        onChange={handleChange}
                      />
                      <CustomRadio
                        label="Pay Half Now"
                        name="paymentOption"
                        value="half"
                        checked={formData.payment_option === "half"}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <label
                    htmlFor="coupon_code"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Coupon Code
                  </label>
                  <input
                    id="coupon_code"
                    name="coupon_code"
                    type="text"
                    value={formData.coupon_code}
                    onChange={handleChange}
                    placeholder="Enter coupon if available"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors duration-200 bg-white placeholder-gray-400 text-gray-800 pr-10"
                  />
                </form>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 sticky top-20">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Summary
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Document Type</span>
                    <span className="font-semibold capitalize">
                      {formData.document_type || "Essay"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity</span>
                    <span className="font-semibold">
                      {formData.pages || 1} page(s)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Academic Level</span>
                    <span className="font-semibold capitalize">
                      {formData.writer_level || "University"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deadline</span>
                    <span className="font-semibold text-sm">
                      {formatDeadline(formData.deadline)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Writer Type</span>
                    <span className="font-semibold capitalize">
                      {formData.writer_type || "Standard"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Writer's Tip</span>
                    <span className="font-semibold">
                      {formData.writer_tip === ""
                        ? "Not included"
                        : `$${parseFloat(formData.writer_tip || 0).toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plagiarism Report</span>
                    <span className="font-semibold">
                      {formData.plagiarism_report ? "Included" : "Not included"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Uploaded Files</span>
                    <span className="font-semibold">
                      {formData.uploadedFiles.length > 0
                        ? formData.uploadedFiles.map((f) => f.name).join(", ")
                        : "None"}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4 mb-6 space-y-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${(formData.total_price || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-800 pt-2">
                    <span>Checkout Amount</span>
                    <span>${(formData.checkout_amount || 0).toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 text-right italic">
                    Inclusive of 6% processing fee
                  </p>
                </div>
                <div className="flex justify-between gap-3">
                  <button
                    onClick={handlePrevious}
                    className="w-1/2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-3 rounded-xl transition-all duration-200 shadow cursor-pointer"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`w-1/2 flex items-center justify-center bg-gradient-to-r ${
                      isSubmitting
                        ? "from-slate-500 to-slate-700"
                        : "from-slate-800 to-slate-900"
                    } text-white py-3 rounded-xl font-semibold hover:from-slate-900 hover:to-slate-950 transition-all duration-300 shadow-lg cursor-pointer ${
                      isSubmitting ? "opacity-80 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                    ) : (
                      "Next"
                    )}
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
