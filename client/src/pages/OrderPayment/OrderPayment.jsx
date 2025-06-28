import { useState, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { endpoint } from "../../server";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

function OrderPayment() {
  const navigate = useNavigate();
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
    writer_tip: "", // Changed from 0 to ""
    plagiarism_report: false,
    payment_option: "full",
    coupon_code: "",
    base_price: 0,
    additional_fees: 0,
    total_price: 0,
    amount_paid: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const DropdownIndicator = ({ selectProps }) => {
    const isOpen = selectProps.menuIsOpen;
    return (
      <div className="mx-2 transition-transform duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)]">
        <ChevronDown
          size={20}
          className={`text-purple-600 transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>
    );
  };

  // Fetch data from localStorage on component mount
  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem("step1Data")) || {};
    setFormData((prev) => ({
      ...prev,
      ...storedOrder,
      plagiarism_report: storedOrder.plagiarism_report || false,
      payment_option: storedOrder.payment_option || "full",
      coupon_code: storedOrder.coupon_code || "",
      base_price: storedOrder.base_price || 0,
      additional_fees: storedOrder.additional_fees || 0,
      total_price: storedOrder.total_price || 0,
      amount_paid: storedOrder.amount_paid || 0,
      writer_tip: storedOrder.writer_tip || "", // Changed to handle empty string
    }));
  }, []);

  // Calculate prices based on formData changes
  useEffect(() => {
    const calculatePrice = () => {
      let total =
        parseFloat(formData.base_price || 0) +
        parseFloat(formData.additional_fees || 0);

      // Add writer_tip
      const tip = parseFloat(formData.writer_tip);
      if (!isNaN(tip) && tip >= 0) {
        total += tip;
      }

      // Add plagiarism report fee
      if (formData.plagiarism_report) {
        total += 6;
      }

      // Calculate amount_paid based on payment_option
      const amountPaid = formData.payment_option === "full" ? total : total / 2;

      setFormData((prev) => ({
        ...prev,
        total_price: total,
        amount_paid: amountPaid,
      }));
    };

    calculatePrice();
  }, [
    formData.writer_tip,
    formData.plagiarism_report,
    formData.payment_option,
    formData.base_price,
    formData.additional_fees,
  ]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "plagiarismReport" && {
        plagiarism_report: value === "yes",
      }),
      ...(name === "writer_tip" && {
        writer_tip: value, // Store as string, including empty string
      }),
      ...(name === "paymentOption" && { payment_option: value }),
      ...(name === "couponCode" && { coupon_code: value }),
      ...(name === "writerType" && { writer_type: value }),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const orderId = localStorage.getItem("orderId");
      if (!orderId) {
        throw new Error("Order ID not found");
      }

      const payload = {
        writer_tip:
          formData.writer_tip === ""
            ? null
            : parseFloat(formData.writer_tip) || 0,
        plagiarism_report: formData.plagiarism_report,
        payment_option: formData.payment_option,
        coupon_code: formData.coupon_code,
        amount_paid: formData.amount_paid,
        total_price: formData.total_price,
      };

      const response = await axios.patch(
        `${endpoint}/orders/post-order/step-two/${orderId}`,
        payload
      );

      // Store step 2 data
      localStorage.setItem(
        "step2Data",
        JSON.stringify({
          ...formData,
          ...payload,
        })
      );

      // Update steps
      setSteps((prev) =>
        prev.map((step) =>
          step.number === 2
            ? { ...step, current: false, completed: true }
            : step.number === 3
            ? { ...step, current: true }
            : step
        )
      );

      // Navigate to confirmation page
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Error submitting order:", error);
      setError(
        error.response?.data?.error || "Failed to process payment details"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    navigate("/order-instructions");
  };

  const FormField = ({
    label,
    name,
    type,
    value,
    onChange,
    options,
    placeholder,
    required = false,
    fullWidth = false,
    readonly = false,
    prefix,
  }) => {
    const baseInputClasses =
      "w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-colors duration-200 bg-white placeholder-gray-400 text-gray-800";
    const readonlyClasses = "bg-gray-50 cursor-not-allowed";
    const selectStyles = {
      control: (provided, state) => ({
        ...provided,
        border: `2px solid ${state.isFocused ? "#7C3AED" : "#D8B4FE"}`,
        borderRadius: "0.5rem",
        padding: "0.5rem",
        backgroundColor: "white",
        boxShadow: state.isFocused
          ? "0 0 0 2px rgba(124, 58, 237, 0.2)"
          : "none",
        "&:hover": { borderColor: "#7C3AED" },
        fontSize: "0.875rem",
        color: "#1F2937",
      }),
      menu: (provided) => ({
        ...provided,
        borderRadius: "0.5rem",
        border: "1px solid #D8B4FE",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        marginTop: "0.25rem",
        zIndex: 50,
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected
          ? "#7C3AED"
          : state.isFocused
          ? "#F3E8FF"
          : "white",
        color: state.isSelected ? "white" : "#1F2937",
        padding: "0.75rem 1rem",
        fontSize: "0.875rem",
        "&:hover": { backgroundColor: "#F3E8FF", color: "#1F2937" },
      }),
      singleValue: (provided) => ({ ...provided, color: "#1F2937" }),
      placeholder: (provided) => ({ ...provided, color: "#9CA3AF" }),
      dropdownIndicator: (provided) => ({
        ...provided,
        color: "#7C3AED",
        "&:hover": { color: "#6B21A8" },
      }),
      indicatorSeparator: () => ({ display: "none" }),
    };

    return (
      <div className={fullWidth ? "col-span-full" : ""}>
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          {type === "select" ? (
            <Select
              value={options?.find((option) => option.value === value) || null}
              onChange={(selected) =>
                onChange({
                  target: { name, value: selected ? selected.value : "" },
                })
              }
              options={options}
              placeholder={placeholder || "Select an option"}
              isDisabled={readonly}
              styles={selectStyles}
              isSearchable={true}
              components={{ DropdownIndicator }}
            />
          ) : type === "textarea" ? (
            <textarea
              id={name}
              name={name}
              value={value}
              onChange={(e) => onChange(e)}
              placeholder={placeholder}
              className={`${baseInputClasses} ${
                readonly ? readonlyClasses : ""
              } min-h-32 resize-vertical`}
              readOnly={readonly}
            />
          ) : type === "checkbox" ? (
            <input
              id={name}
              name={name}
              type="checkbox"
              checked={value}
              onChange={(e) => onChange(e)}
              className="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-400"
            />
          ) : (
            <div className="relative">
              {prefix && (
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  {prefix}
                </span>
              )}
              <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={(e) => onChange(e)}
                placeholder={placeholder}
                className={`${baseInputClasses} ${
                  readonly ? readonlyClasses : ""
                } ${prefix ? "pl-8" : ""}`}
                readOnly={readonly}
                min={type === "number" ? 0 : undefined}
              />
            </div>
          )}
        </div>
      </div>
    );
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
          {/* Progress Tracker */}
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

          {/* Form & Summary Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left - Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-purple-200 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Step 2: Order Payment
                </h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <FormField
                    label="Writer's Tip (optional)"
                    name="writer_tip"
                    type="number"
                    value={formData.writer_tip}
                    onChange={handleChange}
                    placeholder="Add tip in USD"
                    prefix="$"
                  />
                  <div>
                    <label className="block font-medium">
                      Plagiarism Report
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="plagiarismReport"
                          value="yes"
                          checked={formData.plagiarism_report === true}
                          onChange={handleChange}
                        />
                        Yes, attach ($6)
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="plagiarismReport"
                          value="no"
                          checked={formData.plagiarism_report === false}
                          onChange={handleChange}
                        />
                        No, do not attach
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block font-medium mb-2">
                      Payment Option *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="paymentOption"
                          value="full"
                          checked={formData.payment_option === "full"}
                          onChange={handleChange}
                        />
                        Pay in Full
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="paymentOption"
                          value="half"
                          checked={formData.payment_option === "half"}
                          onChange={handleChange}
                        />
                        Pay Half Now
                      </label>
                    </div>
                  </div>
                  <FormField
                    label="Coupon Code"
                    name="couponCode"
                    type="text"
                    value={formData.coupon_code}
                    onChange={handleChange}
                    placeholder="Enter coupon if available"
                  />
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg"
                      disabled={isSubmitting}
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Processing..."
                        : "Proceed to Confirmation"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right - Summary */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 sticky top-20">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Summary
                  </h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Document Type</span>
                      <span className="font-semibold capitalize">
                        {formData.document_type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity</span>
                      <span className="font-semibold">
                        {formData.pages} page(s)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Academic Level</span>
                      <span className="font-semibold capitalize">
                        {formData.writer_level}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deadline</span>
                      <span className="font-semibold text-sm">
                        {new Date(formData.deadline).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
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
                          : `$${parseFloat(formData.writer_tip || 0).toFixed(
                              2
                            )}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plagiarism Report</span>
                      <span className="font-semibold">
                        {formData.plagiarism_report ? "$6.00" : "Not included"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Price</span>
                      <span className="font-semibold">
                        ${(formData.base_price || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Additional Fees</span>
                      <span className="font-semibold">
                        ${(formData.additional_fees || 0).toFixed(2)}
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
                      <span>${(formData.amount_paid || 0).toFixed(2)}</span>
                    </div>
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

export default OrderPayment;
