import { useState, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import Navbar from "../../components/Navbar";

function OrderPayment() {
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
    writer_tip: 0,
    plagiarism_report: false,
    payment_option: "full",
    coupon_code: "",
    base_price: 0,
    additional_fees: 0,
    total_price: 0,
    amount_paid: 0,
  });

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
      writer_tip: storedOrder.writer_tip || 0,
      plagiarism_report: storedOrder.plagiarism_report || false,
      payment_option: storedOrder.payment_option || "full",
      coupon_code: storedOrder.coupon_code || "",
      base_price: storedOrder.base_price || 0,
      additional_fees: storedOrder.additional_fees || 0,
      total_price: storedOrder.total_price || 0,
      amount_paid: storedOrder.amount_paid || 0,
    }));
  }, []);

  // Calculate prices based on formData changes
  useEffect(() => {
    const calculatePrice = () => {
      // Start with base_price and additional_fees from localStorage
      let total =
        parseFloat(formData.total_price || 0) 
        parseFloat(formData.additional_fees || 0);

      // Add writer_tip
      const tip = parseFloat(formData.writer_tip || 0);
      if (!isNaN(tip) && tip > 0) {
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
      ...(name === "tip" && { writer_tip: parseFloat(value) || 0 }),
      ...(name === "paymentOption" && { payment_option: value }),
      ...(name === "couponCode" && { coupon_code: value }),
      ...(name === "writerType" && { writer_type: value }),
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("orderData", JSON.stringify(formData));
    window.location.href = "/order-confirmation";
  };

  // Handle Previous button
  const handlePrevious = () => {
    window.location.href = "/order-instructions";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <Navbar />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Progress Tracker */}
          <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200 z-0">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                  style={{ width: "33%" }}
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
                  <div>
                    <label className="block font-medium mb-2">
                      Writer's Tip (optional)
                    </label>
                    <input
                      type="number"
                      name="tip"
                      value={formData.writer_tip}
                      onChange={handleChange}
                      placeholder="Add tip in USD"
                      min="0"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">
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
                    </div>
                  </div>
                  <div>
                    <label className="block font-medium mb-2">
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      name="couponCode"
                      value={formData.coupon_code}
                      onChange={handleChange}
                      placeholder="Enter coupon if available"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg"
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg"
                    >
                      Proceed to Confirmation
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
                        ${(formData.writer_tip || 0).toFixed(2)}
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
