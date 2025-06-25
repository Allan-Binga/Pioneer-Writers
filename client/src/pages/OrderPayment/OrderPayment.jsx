import { useState } from "react";
import { Check } from "lucide-react";
import { Navigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

function OrderPayment() {
  const steps = [
    { number: 1, title: "Assignment Instructions", completed: true },
    { number: 2, title: "Order Payment", current: true },
    { number: 3, title: "Order Confirmation", completed: false },
  ];

  const [formData, setFormData] = useState({
    writerType: "",
    deadline: "",
    tip: "",
    plagiarismReport: "",
    paymentOption: "",
    couponCode: "",
  });

  // Calculate prices based on provided rules
  // useEffect(() => {
  //   const calculatePrice = () => {
  //     let basePrice = 20; // Default for Writing from Scratch, Custom Essay, University, 1 page, Double-spaced

  //     // Type of Service
  //     if (formData.type_of_service === "editing") {
  //       basePrice -= 9; // $11
  //     } else if (formData.type_of_service === "calculations") {
  //       basePrice -= 6; // $14
  //     }

  //     // Document Type
  //     if (
  //       ["article_review", "thesis", "dissertation"].includes(
  //         formData.document_type
  //       )
  //     ) {
  //       basePrice += 5; // $25
  //     } else if (formData.document_type === "math-problems") {
  //       basePrice += 10; // $30
  //     }

  //     // Writer Level
  //     if (formData.writer_level === "college") {
  //       basePrice -= 2;
  //     } else if (formData.writer_level === "masters") {
  //       basePrice += 2;
  //     } else if (formData.writer_level === "phd") {
  //       basePrice += 4;
  //     }

  //     // Spacing
  //     if (formData.spacing === "single") {
  //       basePrice *= 2;
  //     }

  //     // Pages
  //     const pages = parseInt(formData.pages) || 1;
  //     let totalPrice = basePrice * pages;

  //     // Step 2 Fields
  //     let additionalFees = 0;

  //     // Writer Type
  //     if (formData.writer_type === "premium") {
  //       additionalFees += 7;
  //     } else if (formData.writer_type === "platinum") {
  //       additionalFees += 12;
  //     }

  //     // Deadline
  //     if (formData.deadline) {
  //       const deadlineDate = new Date(formData.deadline);
  //       const now = new Date();
  //       const hoursUntilDeadline = (deadlineDate - now) / (1000 * 60 * 60);
  //       if (hoursUntilDeadline < 5) {
  //         additionalFees += 20;
  //       } else if (hoursUntilDeadline <= 8) {
  //         additionalFees += 14;
  //       } else if (hoursUntilDeadline <= 11) {
  //         additionalFees += 10;
  //       } else if (hoursUntilDeadline <= 14) {
  //         additionalFees += 5;
  //       } else if (hoursUntilDeadline <= 17) {
  //         additionalFees += 4;
  //       } else if (hoursUntilDeadline <= 23) {
  //         additionalFees += 3;
  //       } else if (hoursUntilDeadline <= 24) {
  //         additionalFees += 2;
  //       } else if (hoursUntilDeadline > 7 * 24) {
  //         totalPrice = 19.08; // Override for > 7 days, including 6% processing fee
  //         additionalFees = 0; // Reset additional fees
  //       } else {
  //         additionalFees += 2; // Default for >= 24 hours
  //       }
  //     }

  //     // Writer's Tip
  //     additionalFees += parseFloat(formData.writer_tip) || 0;

  //     // Plagiarism Report
  //     if (formData.plagiarism_report) {
  //       additionalFees += 6;
  //     }

  //     // Processing Fee (6%)
  //     if (
  //       formData.deadline &&
  //       (new Date(formData.deadline) - new Date()) / (1000 * 60 * 60) <= 7 * 24
  //     ) {
  //       totalPrice += totalPrice * 0.06;
  //     }

  //     // Apply additional fees
  //     totalPrice += additionalFees;

  //     setFormData((prev) => ({
  //       ...prev,
  //       base_price: basePrice,
  //       additional_fees: additionalFees,
  //       total_price: totalPrice,
  //       amount_paid:
  //         formData.payment_option === "full" ? totalPrice : totalPrice / 2,
  //     }));
  //   };

  //   calculatePrice();
  // }, [
  //   formData.type_of_service,
  //   formData.document_type,
  //   formData.writer_level,
  //   formData.spacing,
  //   formData.pages,
  //   formData.writer_type,
  //   formData.deadline,
  //   formData.writer_tip,
  //   formData.plagiarism_report,
  //   formData.payment_option,
  // ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
                <form className="space-y-6">
                  {/* <FormField
                    label="Payment Option"
                    name="payment_option"
                    type="select"
                    value={formData.payment_option}
                    onChange={handleInputChange}
                    options={[
                      { value: "full", label: "Pay in Full" },
                      { value: "installments", label: "Installments" },
                    ]}
                    required
                  /> */}
                  {/* <FormField
                    label="Coupon Code"
                    name="coupon_code"
                    type="text"
                    value={formData.coupon_code}
                    onChange={handleInputChange}
                    placeholder="Enter coupon code"
                  /> */}
                  {/* <FormField
                    label="Writer's Tip"
                    name="writer_tip"
                    type="number"
                    value={formData.writer_tip}
                    onChange={handleInputChange}
                    placeholder="Enter tip amount"
                    suffix="USD"
                  /> */}
                  {/* <FormField
                    label="Plagiarism Report"
                    name="plagiarism_report"
                    type="checkbox"
                    value={formData.plagiarism_report}
                    onChange={(name, value) => handleInputChange(name, value)}
                  /> */}
                  {/* Writer Type */}
                  <div>
                    <label className="block font-medium mb-2">
                      Select Writer Type *
                    </label>
                    <select
                      name="writerType"
                      value={formData.writerType}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      {/* <div className="flex justify-between items-center">
                        <span className="text-gray-600">Writer Type</span>
                        <span className="font-semibold">
                          {formData.writer_type}
                        </span>
                      </div> */}
                      <option value="">-- Choose Writer Type --</option>
                      <option value="standard">Standard Writer</option>
                      <option value="premium">Premium Writer</option>
                      <option value="top">Top 10 Writer</option>
                    </select>
                  </div>
                  {/* 
                   <FormField
                    label="Writer Type"
                    name="writer_type"
                    type="select"
                    value={formData.writer_type}
                    onChange={handleInputChange}
                    options={[
                      { value: "standard", label: "Standard" },
                      { value: "premium", label: "Premium" },
                      { value: "platinum", label: "Platinum" },
                    ]}
                    required
                  /> */}

                  {/* Tip */}
                  <div>
                    <label className="block font-medium mb-2">
                      Writer's Tip (optional)
                    </label>
                    <input
                      type="number"
                      name="tip"
                      value={formData.tip}
                      onChange={handleChange}
                      placeholder="Add tip in USD"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    />
                  </div>

                  {/* Plagiarism Report */}
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
                          checked={formData.plagiarismReport === "yes"}
                          onChange={handleChange}
                        />
                        Yes, attach
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="plagiarismReport"
                          value="no"
                          checked={formData.plagiarismReport === "no"}
                          onChange={handleChange}
                        />
                        No, do not attach
                      </label>
                    </div>
                  </div>

                  {/* Payment Option */}
                  <div>
                    <label className="block font-medium mb-2">
                      Payment Option *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="paymentOption"
                          value="installments"
                          checked={formData.paymentOption === "installments"}
                          onChange={handleChange}
                        />
                        Pay in Installments
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="paymentOption"
                          value="full"
                          checked={formData.paymentOption === "full"}
                          onChange={handleChange}
                        />
                        Pay in Full
                      </label>
                    </div>
                  </div>

                  {/* Coupon */}
                  <div>
                    <label className="block font-medium mb-2">
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      name="couponCode"
                      value={formData.couponCode}
                      onChange={handleChange}
                      placeholder="Enter coupon if available"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    />
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
                      <span className="text-gray-600">Essay</span>
                      <span className="font-semibold">$16</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity</span>
                      <span className="font-semibold">1 page</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Academic Level</span>
                      <span className="font-semibold">Undergraduate</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deadline</span>
                      <span className="font-semibold text-sm">
                        by 10:07 PM - July 3
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Basic Writer</span>
                      <span className="font-semibold">Included</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-6 space-y-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total (Before Fee)</span>
                      <span>$20.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Processing Fee (6%)</span>
                      <span>$1.20</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-800 pt-2">
                      <span>Checkout Amount</span>
                      <span>$21.20</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      className="bg-gray-200 text-gray-800 font-semibold py-3 rounded-xl hover:bg-gray-300 transition"
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-slate-800 to-slate-900 text-white font-semibold py-3 rounded-xl hover:from-slate-900 hover:to-slate-950 transition"
                    >
                      Next
                    </button>
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
