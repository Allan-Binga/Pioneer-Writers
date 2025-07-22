import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useState, useEffect, useCallback } from "react";
import { Check, Calendar } from "lucide-react";
import { notify } from "../../utils/toast";

function NewOrder() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type_of_service: "writing",
    writer_level: "university",
    document_type: "essay",
    english_type: "",
    pages: "1",
    number_of_words: 275,
    deadline: "",
    total_price: 20,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [steps, setSteps] = useState([
    {
      number: 1,
      title: "Assignment Instructions",
      current: true,
      completed: false,
    },
    {
      number: 2,
      title: "Order Confirmation",
      current: false,
      completed: false,
    },
    { number: 3, title: "Order Payment", current: false, completed: false },
  ]);

  // Load saved data from localStorage
  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem("step1Data")) || {};
    setFormData((prev) => ({
      ...prev,
      type_of_service: storedOrder.type_of_service || "writing",
      writer_level: storedOrder.writer_level || "university",
      pages: storedOrder.pages ? String(storedOrder.pages) : "1",
      number_of_words: storedOrder.number_of_words || 275,
      document_type: storedOrder.document_type || "essay",
      deadline: storedOrder.deadline
        ? new Date(storedOrder.deadline).toISOString().slice(0, 16)
        : "",
      total_price: storedOrder.total_price || 20,
      english_type: storedOrder.english_type || "usa",
    }));
  }, []);

  // Calculate price
  useEffect(() => {
    const calculatePrice = () => {
      let basePrice = 20;
      if (formData.type_of_service === "editing") basePrice -= 9;
      else if (formData.type_of_service === "powerpoint") basePrice -= 6;
      if (
        ["article_review", "thesis", "dissertation"].includes(
          formData.document_type
        )
      )
        basePrice += 5;
      else if (formData.document_type === "math-problems") basePrice += 10;
      if (formData.writer_level === "college") basePrice -= 2;
      else if (formData.writer_level === "masters") basePrice += 2;
      else if (formData.writer_level === "phd") basePrice += 4;
      const pages = parseInt(formData.pages) || 1;
      let totalPrice = basePrice * pages;
      if (formData.deadline) {
        const hoursUntilDeadline =
          (new Date(formData.deadline) - new Date()) / (1000 * 60 * 60);
        if (hoursUntilDeadline > 7 * 24) totalPrice = 19.08;
      }
      setFormData((prev) => ({ ...prev, total_price: totalPrice }));
    };
    calculatePrice();
  }, [
    formData.type_of_service,
    formData.writer_level,
    formData.document_type,
    formData.pages,
    formData.deadline,
  ]);

  // Handle input changes
  const handleInputChange = useCallback((name, value) => {
    if (name === "pages") {
      const pages = parseInt(value, 10) || 1;
      setFormData((prevData) => ({
        ...prevData,
        pages: value,
        number_of_words: pages * 275,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const requiredFields = [
      "type_of_service",
      "writer_level",
      "document_type",
      "pages",
      "deadline",
      "english_type",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      notify.error(
        `Please fill all required fields: ${missingFields.join(", ")}`
      );
      setIsSubmitting(false);
      return;
    }
    const orderData = {
      type_of_service: formData.type_of_service,
      writer_level: formData.writer_level,
      document_type: formData.document_type,
      pages: formData.pages,
      number_of_words: parseInt(formData.number_of_words) || 0,
      deadline: new Date(formData.deadline).toISOString(),
      english_type: formData.english_type,
      total_price: formData.total_price,
    };
    localStorage.setItem("step1Data", JSON.stringify(orderData));
    notify.success("Order details saved successfully");
    setSteps((prev) =>
      prev.map((step, index) =>
        index === 0
          ? { ...step, current: false, completed: true }
          : index === 1
          ? { ...step, current: true }
          : step
      )
    );
    navigate("/order-confirmation", {
      state: { order: orderData, total_price: formData.total_price },
    });
    setIsSubmitting(false);
  };

  const OptionCard = ({ value, label, selected, onClick }) => {
    return (
      <div
        onClick={onClick}
        className={`relative cursor-pointer p-4 transition duration-200 bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 rounded-lg shadow-sm border ${
          selected ? "border-teal-500 bg-teal-50" : "border-slate-200"
        }`}
      >
        <div className="text-sm font-medium text-slate-700">{label}</div>
        {selected && (
          <Check className="absolute top-3 right-3 text-teal-500 w-5 h-5" />
        )}
      </div>
    );
  };

  // Format deadline for display
  const formatDeadline = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "Not set";

  // react-select custom styles
  const selectStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid #e2e8f0",
      borderRadius: "0.5rem",
      padding: "0.5rem",
      boxShadow: "none",
      "&:hover": { borderColor: "#2dd4bf" },
      "&:focus-within": {
        borderColor: "#2dd4bf",
        boxShadow: "0 0 0 2px rgba(45, 212, 191, 0.2)",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#2dd4bf"
        : state.isFocused
        ? "#f1f5f9"
        : "white",
      color: state.isSelected ? "white" : "#1e293b",
      padding: "0.75rem 1rem",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      border: "1px solid #e2e8f0",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    }),
  };

  // Options for document type and pages
  const documentTypeOptions = [
    { value: "essay", label: "Essay (Any Type)" },
    { value: "coursework", label: "Coursework" },
    { value: "business-plan", label: "Business Plan" },
    { value: "article_review", label: "Article Review" },
    { value: "dissertation", label: "Dissertation" },
    { value: "thesis", label: "Thesis" },
    { value: "math-problems", label: "Mathematics Problems" },
  ];

  const pageOptions = Array.from({ length: 100 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1} page${i + 1 > 1 ? "s" : ""}`,
  }));

  const englishTypeOptions = [
    { value: "usa", label: "USA" },
    { value: "uk", label: "UK" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="p-6 mb-4 mt-4">
            <div className="flex items-center justify-between relative">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="relative z-10 flex items-center"
                >
                  <div
                    className={`flex items-center px-8 py-4 rounded-full border text-sm font-medium transition-all duration-300 ${
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">
                  Basic Paper Instructions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Type of Service */}
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Type of Service <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { value: "writing", label: "Writing from scratch" },
                        { value: "editing", label: "Editing & Proofreading" },
                        {
                          value: "powerpoint",
                          label: "PowerPoint Presentation",
                        },
                      ].map((option) => (
                        <OptionCard
                          key={option.value}
                          value={option.value}
                          label={option.label}
                          selected={formData.type_of_service === option.value}
                          onClick={() =>
                            handleInputChange("type_of_service", option.value)
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {/* Writer Level */}
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Writer Level <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      {[
                        { value: "university", label: "University" },
                        { value: "college", label: "College" },
                        { value: "masters", label: "Masters" },
                        { value: "phd", label: "Doctorate" },
                      ].map((option) => (
                        <OptionCard
                          key={option.value}
                          value={option.value}
                          label={option.label}
                          selected={formData.writer_level === option.value}
                          onClick={() =>
                            handleInputChange("writer_level", option.value)
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {/* Document Type */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Document Type <span className="text-red-500">*</span>
                    </label>
                    <Select
                      name="document_type"
                      value={documentTypeOptions.find(
                        (opt) => opt.value === formData.document_type
                      )}
                      onChange={(option) =>
                        handleInputChange("document_type", option.value)
                      }
                      options={documentTypeOptions}
                      styles={selectStyles}
                      placeholder="Select document type"
                    />
                  </div>

                  {/* Pages */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Pages <span className="text-red-500">*</span>
                    </label>
                    <Select
                      name="pages"
                      value={pageOptions.find(
                        (opt) => opt.value === formData.pages
                      )}
                      onChange={(option) =>
                        handleInputChange("pages", option.value)
                      }
                      options={pageOptions}
                      styles={selectStyles}
                      placeholder="Select pages"
                    />
                  </div>

                  {/* Number of Words */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Number of Words
                    </label>
                    <input
                      type="number"
                      name="number_of_words"
                      value={formData.number_of_words}
                      onChange={(e) =>
                        handleInputChange("number_of_words", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  {/* Deadline */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Deadline <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        name="deadline"
                        value={formData.deadline}
                        onChange={(e) =>
                          handleInputChange("deadline", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-10"
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    </div>
                  </div>

                  {/* English Type */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Select English Type{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Select
                      name="english_type"
                      value={englishTypeOptions.find(
                        (opt) => opt.value === formData.english_type
                      )}
                      onChange={(option) =>
                        handleInputChange("english_type", option.value)
                      }
                      options={englishTypeOptions}
                      styles={selectStyles}
                      placeholder="Select English type"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-6">
                <h3 className="text-xl font-bold text-slate-800 mb-6">
                  Summary
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Document Type</span>
                    <span className="font-semibold">
                      {formData.document_type
                        ? formData.document_type.charAt(0).toUpperCase() +
                          formData.document_type.slice(1)
                        : "Essay"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Quantity</span>
                    <span className="font-semibold">
                      {formData.pages || 1} page(s)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Academic Level</span>
                    <span className="font-semibold">
                      {formData.writer_level
                        ? formData.writer_level.charAt(0).toUpperCase() +
                          formData.writer_level.slice(1)
                        : "University"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Deadline</span>
                    <span className="font-semibold text-sm">
                      {formatDeadline(formData.deadline)}
                    </span>
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-4 mb-6">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>${formData.total_price.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center cursor-pointer bg-gradient-to-r ${
                    isSubmitting
                      ? "from-slate-400 to-slate-600"
                      : "from-teal-500 to-teal-700"
                  } text-white py-4 rounded-xl font-semibold hover:from-teal-600 hover:to-teal-800 ${
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
      </main>
      <Footer />
    </div>
  );
}

export default NewOrder;
