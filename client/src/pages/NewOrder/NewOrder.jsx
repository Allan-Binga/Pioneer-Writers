import { useNavigate } from "react-router-dom";
import Select, { components } from "react-select";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useState, useEffect, useCallback } from "react";
import { Check, ChevronDown } from "lucide-react";
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

  // Custom Dropdown Indicator
  const DropdownIndicator = (props) => (
    <components.DropdownIndicator {...props}>
      <svg
        className="w-4 h-4 text-slate-500"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </components.DropdownIndicator>
  );

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
    }));
  }, []);

  // Calculate price
  useEffect(() => {
    const calculatePrice = () => {
      let basePrice = 20; // Default: Writing, Essay, University, 1 page
      if (formData.type_of_service === "editing") basePrice -= 9;
      else if (formData.type_of_service === "calculations") basePrice -= 6;
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
      const pages = parseInt(value, 10);
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

  // Reusable FormField component
  const FormField = ({
    label,
    name,
    type,
    value,
    onChange,
    options,
    required = false,
  }) => {
    // Refined select styles
    const selectStyles = {
      control: (provided, state) => ({
        ...provided,
        border: `1.8px solid ${state.isFocused ? "#475569" : "#CBD5E1"}`,
        borderRadius: "0.75rem",
        padding: "0.35rem 0.5rem",
        backgroundColor: "#fff",
        transition: "border-color 0.2s ease-in-out, box-shadow 0.2s",
        boxShadow: state.isFocused
          ? "0 0 0 3px rgba(100, 116, 139, 0.2)"
          : "none",
        "&:hover": {
          borderColor: "#475569",
        },
      }),
      menu: (provided) => ({
        ...provided,
        borderRadius: "0.75rem",
        border: "1px solid #CBD5E1",
        padding: "0.3rem 0",
        zIndex: 30,
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected
          ? "#334155"
          : state.isFocused
          ? "#F8FAFC"
          : "#fff",
        color: state.isSelected ? "#fff" : "#0F172A",
        padding: "0.5rem 1rem",
        fontSize: "0.925rem",
        cursor: "pointer",
      }),
      singleValue: (provided) => ({
        ...provided,
        color: "#0F172A",
        fontWeight: 500,
      }),
      placeholder: (provided) => ({
        ...provided,
        color: "#94A3B8",
      }),
      indicatorSeparator: () => ({ display: "none" }),
    };

    return (
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {type === "select" ? (
          <Select
            value={options.find((option) => option.value === value) || null}
            onChange={(selected) =>
              onChange(name, selected ? selected.value : "")
            }
            options={options}
            styles={selectStyles}
            isSearchable={true}
            components={{ DropdownIndicator }}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* <h1 className="text-2xl font-semibold text-slate-800 mb-6 mt-6">
            Place Order
          </h1> */}
          {/*Progress Tracker*/}
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Step 1: Assignment Instructions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Type of Service"
                    name="type_of_service"
                    type="select"
                    value={formData.type_of_service}
                    onChange={handleInputChange}
                    options={[
                      { value: "writing", label: "Writing from scratch" },
                      { value: "editing", label: "Editing & Proofreading" },
                      {
                        value: "calculations",
                        label: "PowerPoint Presentation",
                      },
                    ]}
                    required
                  />
                  <FormField
                    label="Writer Level"
                    name="writer_level"
                    type="select"
                    value={formData.writer_level}
                    onChange={handleInputChange}
                    options={[
                      { value: "university", label: "University" },
                      { value: "college", label: "College" },
                      { value: "masters", label: "Masters" },
                      { value: "phd", label: "Doctorate" },
                    ]}
                    required
                  />
                  <FormField
                    label="Document Type"
                    name="document_type"
                    type="select"
                    value={formData.document_type}
                    onChange={handleInputChange}
                    options={[
                      { value: "essay", label: "Essay (Any Type)" },
                      { value: "coursework", label: "Coursework" },
                      { value: "business-plan", label: "Business Plan" },
                      { value: "article_review", label: "Article Review" },
                      { value: "dissertation", label: "Dissertation" },
                      { value: "thesis", label: "Thesis" },
                      { value: "math-problems", label: "Mathematics Problems" },
                    ]}
                    required
                  />
                  <FormField
                    label="Pages"
                    name="pages"
                    type="select"
                    value={formData.pages}
                    onChange={handleInputChange}
                    options={Array.from({ length: 100 }, (_, i) => ({
                      value: `${i + 1}`,
                      label: `${i + 1}`,
                    }))}
                    required
                  />
                  <FormField
                    label="Number of Words"
                    name="number_of_words"
                    type="number"
                    value={formData.number_of_words}
                    onChange={handleInputChange}
                    suffix="Words"
                  />
                  <FormField
                    label="Deadline"
                    name="deadline"
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    required
                  />
                  <FormField
                    label="Select English Type"
                    name="english_type"
                    type="select"
                    value={formData.english_type}
                    onChange={handleInputChange}
                    options={[
                      { value: "usa", label: "USA" },
                      { value: "uk", label: "UK" },
                    ]}
                    required
                  />
                </div>
              </div>
            </div>
            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Summary
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Document Type</span>
                    <span className="font-semibold">
                      {formData.document_type
                        ? formData.document_type.charAt(0).toUpperCase() +
                          formData.document_type.slice(1)
                        : "Essay"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Quantity</span>
                    <span className="font-semibold">
                      {formData.pages || 1} page(s)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Academic Level</span>
                    <span className="font-semibold">
                      {formData.writer_level
                        ? formData.writer_level.charAt(0).toUpperCase() +
                          formData.writer_level.slice(1)
                        : "University"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Deadline</span>
                    <span className="font-semibold text-sm">
                      {formatDeadline(formData.deadline)}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4 mb-6">
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
                      ? "from-slate-500 to-slate-700"
                      : "from-slate-800 to-slate-900"
                  } text-white py-4 rounded-xl font-semibold hover:from-slate-900 hover:to-slate-950 ${
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
      <Footer/>
    </div>
  );
}

export default NewOrder;
