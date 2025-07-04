import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Navbar from "../../components/Navbar";
import { useState, useEffect, useCallback } from "react";
import { Check, CloudUpload, X, FileText, ChevronDown } from "lucide-react";
import { notify } from "../../utils/toast";

function NewOrder() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    topic_field: "",
    type_of_service: "writing",
    document_type: "essay",
    writer_level: "university",
    paper_format: "",
    spacing: "double",
    pages: "1",
    number_of_words: 275,
    number_of_sources: 1,
    english_type: "",
    topic: "",
    instructions: "",
    writer_type: "standard",
    deadline: "",
    total_price: 20,
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
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
    {
      number: 3,
      title: "Order Payment",
      current: false,
      completed: false,
    },
  ]);
  const [error, setError] = useState(null);

  //Dropdown Indicator
  const DropdownIndicator = (props) => {
    const { selectProps } = props;
    const isOpen = selectProps.menuIsOpen;

    return (
      <div className="mx-2 transition-transform duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)]">
        <ChevronDown
          size={20}
          className={`text-slate-600 transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>
    );
  };

  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem("step1Data")) || {};
    setFormData((prev) => ({
      ...prev,
      topic_field: storedOrder.topic_field || "",
      type_of_service: storedOrder.type_of_service || "writing",
      document_type: storedOrder.document_type || "essay",
      writer_level: storedOrder.writer_level || "university",
      paper_format: storedOrder.paper_format || "",
      spacing: storedOrder.spacing || "double",
      pages: storedOrder.pages ? String(storedOrder.pages) : "1",
      number_of_words: storedOrder.number_of_words || 275,
      number_of_sources: storedOrder.number_of_sources || 1,
      english_type: storedOrder.english_type || "",
      topic: storedOrder.topic || "",
      instructions: storedOrder.instructions || "",
      writer_type: storedOrder.writer_type || "standard",
      deadline: storedOrder.deadline
        ? new Date(storedOrder.deadline).toISOString().slice(0, 16)
        : "",
      total_price: storedOrder.total_price || 20,
    }));
    if (storedOrder.uploadedFiles) {
      setUploadedFiles(
        storedOrder.uploadedFiles.map((file) => ({
          name: file.name,
          size: file.size,
        }))
      );
    }
  }, []);

  // Calculate prices based on provided rules
  useEffect(() => {
    const calculatePrice = () => {
      let basePrice = 20; // Default for Writing from Scratch, Custom Essay, University, 1 page, Double-spaced

      // Type of Service
      if (formData.type_of_service === "editing") {
        basePrice -= 9;
      } else if (formData.type_of_service === "calculations") {
        basePrice -= 6;
      }

      // Document Type
      if (
        ["article_review", "thesis", "dissertation"].includes(
          formData.document_type
        )
      ) {
        basePrice += 5;
      } else if (formData.document_type === "math-problems") {
        basePrice += 10;
      }

      // Writer Level
      if (formData.writer_level === "college") {
        basePrice -= 2;
      } else if (formData.writer_level === "masters") {
        basePrice += 2;
      } else if (formData.writer_level === "phd") {
        basePrice += 4;
      }

      // Spacing
      if (formData.spacing === "single") {
        basePrice *= 2;
      }

      // Pages
      const pages = parseInt(formData.pages) || 1;
      let totalPrice = basePrice * pages;

      // Special override for deadlines > 7 days
      if (formData.deadline) {
        const deadlineDate = new Date(formData.deadline);
        const now = new Date();
        const hoursUntilDeadline = (deadlineDate - now) / (1000 * 60 * 60);
        if (hoursUntilDeadline > 7 * 24) {
          totalPrice = 19.08; // Override
        }
      }

      setFormData((prev) => ({
        ...prev,
        base_price: basePrice,
        total_price: totalPrice,
        amount_paid:
          formData.payment_option === "full" ? totalPrice : totalPrice / 2,
      }));
    };

    calculatePrice();
  }, [
    formData.type_of_service,
    formData.document_type,
    formData.writer_level,
    formData.spacing,
    formData.pages,
    formData.writer_type,
    formData.deadline,
  ]);

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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const requiredFields = [
      "topic_field",
      "type_of_service",
      "document_type",
      "writer_level",
      "paper_format",
      "english_type",
      "pages",
      "spacing",
      "topic",
      "writer_type",
      "deadline",
      "total_price",
    ];

    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      console.warn("Missing required fields:", missingFields);
      notify.error(
        `Please fill all required fields: ${missingFields.join(", ")}`
      );
      setIsSubmitting(false);
      return;
    }

    // Prepare data for localStorage
    const orderData = {
      topic_field: formData.topic_field,
      type_of_service: formData.type_of_service,
      document_type: formData.document_type,
      writer_level: formData.writer_level,
      paper_format: formData.paper_format,
      spacing: formData.spacing,
      pages: formData.pages,
      number_of_words: parseInt(formData.number_of_words) || 0,
      number_of_sources: parseInt(formData.number_of_sources) || 0,
      english_type: formData.english_type,
      topic: formData.topic,
      instructions: formData.instructions,
      writer_type: formData.writer_type,
      deadline: new Date(formData.deadline).toISOString(),
      total_price: formData.total_price,
      uploadedFiles: uploadedFiles.map((file) => ({
        name: file.name,
        size: file.size,
      })),
    };

    // Save to localStorage
    localStorage.setItem("step1Data", JSON.stringify(orderData));
    // console.log("Files to pass to OrderPayment:", uploadedFiles);

    // console.log("Order data saved to localStorage:", orderData);

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
      state: {
        order: orderData,
        total_price: formData.total_price,
        files: uploadedFiles,
      },
    });

    setIsSubmitting(false);
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
    suffix,
  }) => {
    const baseInputClasses =
      "w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200 bg-white placeholder-slate-400 text-slate-800";
    const readonlyClasses = "bg-slate-100 cursor-not-allowed";

    const selectStyles = {
      control: (provided, state) => ({
        ...provided,
        border: `2px solid ${state.isFocused ? "#64748b" : "#cbd5e1"}`, // slate-500 or slate-300
        borderRadius: "0.5rem",
        padding: "0.5rem",
        backgroundColor: readonly ? "#f1f5f9" : "white", // slate-100
        boxShadow: state.isFocused
          ? "0 0 0 2px rgba(100, 116, 139, 0.2)"
          : "none",
        "&:hover": { borderColor: "#64748b" },
        fontSize: "0.875rem",
        color: "#1e293b", // slate-800
      }),
      menu: (provided) => ({
        ...provided,
        borderRadius: "0.5rem",
        border: "1px solid #cbd5e1", // slate-300
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        marginTop: "0.25rem",
        zIndex: 50,
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected
          ? "#64748b" // slate-500
          : state.isFocused
          ? "#f1f5f9" // slate-100
          : "white",
        color: state.isSelected ? "white" : "#1e293b", // slate-800
        padding: "0.75rem 1rem",
        fontSize: "0.875rem",
        "&:hover": { backgroundColor: "#f1f5f9", color: "#1e293b" },
      }),
      singleValue: (provided) => ({ ...provided, color: "#1e293b" }), // slate-800
      placeholder: (provided) => ({ ...provided, color: "#94a3b8" }), // slate-400
      dropdownIndicator: (provided) => ({
        ...provided,
        color: "#64748b", // slate-500
        "&:hover": { color: "#475569" }, // slate-600
      }),
      indicatorSeparator: () => ({ display: "none" }),
    };

    return (
      <div className={fullWidth ? "col-span-full" : ""}>
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-slate-700 mb-2"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          {type === "select" ? (
            <Select
              value={options?.find((option) => option.value === value) || null}
              onChange={(selected) =>
                onChange(name, selected ? selected.value : "")
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
              onChange={(e) => onChange(name, e.target.value)}
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
              onChange={(e) => onChange(name, e.target.checked)}
              className="h-5 w-5 text-slate-600 border-slate-300 rounded focus:ring-slate-500"
            />
          ) : (
            <input
              id={name}
              name={name}
              type={type}
              value={value}
              onChange={(e) =>
                onChange(
                  name,
                  type === "number"
                    ? parseFloat(e.target.value) || 0
                    : e.target.value
                )
              }
              placeholder={placeholder}
              className={`${baseInputClasses} ${
                readonly ? readonlyClasses : ""
              } ${suffix ? "pr-10" : ""}`}
              readOnly={readonly}
            />
          )}
          {suffix &&
            type !== "select" &&
            type !== "textarea" &&
            type !== "checkbox" && (
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">
                {suffix}
              </span>
            )}
        </div>
      </div>
    );
  };

  // Format deadline for display
  const formatDeadline = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          {/* Progress Tracker */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
            <div className="flex items-center justify-between relative">
              {/* Track line */}
              <div className="absolute top-6 left-0 w-full h-0.5 bg-slate-300 z-0">
                <div
                  className="h-full bg-gradient-to-r from-slate-600 to-slate-800 transition-all duration-500"
                  style={{
                    width: `${
                      (steps.findIndex((s) => s.current) / (steps.length - 1)) *
                      100
                    }%`,
                  }}
                />
              </div>

              {/* Steps */}
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center relative z-10"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      step.completed
                        ? "bg-gradient-to-r from-slate-600 to-slate-800 border-slate-700 text-white"
                        : step.current
                        ? "bg-gradient-to-r from-slate-600 to-slate-800 border-slate-700 text-white shadow-md"
                        : "bg-white border-slate-300 text-slate-400"
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
                      step.current ? "text-slate-700" : "text-slate-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Step 1: Assignment Instructions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Topic Field"
                    name="topic_field"
                    type="select"
                    value={formData.topic_field}
                    onChange={handleInputChange}
                    options={[
                      { value: "", label: "Topic Field" },
                      { value: "art", label: "Art" },
                      { value: "architecture", label: "Architecture" },
                      { value: "dance", label: "Dance" },
                      { value: "design-analysis", label: "Design Analysis" },
                      { value: "drama", label: "Drama" },
                      { value: "movies", label: "Movies" },
                      { value: "music", label: "Music" },
                      { value: "paintings", label: "Paintings" },
                      { value: "theatre", label: "Theatre" },
                      { value: "biology", label: "Biology" },
                      { value: "business", label: "Business" },
                      { value: "chemistry", label: "Chemistry" },
                      {
                        value: "media-communication",
                        label: "Media and Communication",
                      },
                      { value: "advertising", label: "Advertising" },
                      {
                        value: "communication-strategies",
                        label: "Communication Strategies",
                      },
                      { value: "journalism", label: "Journalism" },
                      { value: "public-relations", label: "Public Relations" },
                      { value: "creative-writing", label: "Creative Writing" },
                      { value: "economics", label: "Economics" },
                      {
                        value: "economics-accounting",
                        label: "Economics Accounting",
                      },
                      {
                        value: "economics-case-study",
                        label: "Economics Case Study",
                      },
                      { value: "company-analysis", label: "Company Analysis" },
                      { value: "e-commerce", label: "E-commerce" },
                      {
                        value: "economics-finance",
                        label: "Economics Finance",
                      },
                      { value: "investments", label: "Investments" },
                      { value: "logistics", label: "Logistics" },
                      { value: "trade", label: "Trade" },
                      { value: "education", label: "Education" },
                      {
                        value: "application-essay",
                        label: "Application Essay",
                      },
                      {
                        value: "education-theories",
                        label: "Education Theories",
                      },
                      { value: "engineering", label: "Engineering" },
                      { value: "english", label: "English" },
                      { value: "ethics", label: "Ethics" },
                      { value: "history", label: "History" },
                      {
                        value: "african-american-studies",
                        label: "African American Studies",
                      },
                      { value: "american-history", label: "American History" },
                      { value: "law", label: "Law" },
                    ]}
                    required
                  />
                  <FormField
                    label="Type of Service"
                    name="type_of_service"
                    type="select"
                    value={formData.type_of_service}
                    onChange={handleInputChange}
                    options={[
                      { value: "re-writing", label: "Re-writing" },
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
                    label="Document type"
                    name="document_type"
                    type="select"
                    value={formData.document_type}
                    onChange={handleInputChange}
                    options={[
                      { value: "essay", label: "Essay (Any Type)" },
                      { value: "coursework", label: "Coursework" },
                      { value: "business-plan", label: "Business Plan" },
                      {
                        value: "literature-review",
                        label: "Literature Review",
                      },
                      { value: "math-problems", label: "Mathematics Problems" },
                      { value: "research-paper", label: "Research Paper" },
                      { value: "mcqs", label: "Multiple Choice Questions" },
                      {
                        value: "presentation",
                        label: "Presentation or Speech",
                      },
                      {
                        value: "research-proposal",
                        label: "Research Proposal",
                      },
                      {
                        value: "annotated-bib",
                        label: "Annotated Bibliography",
                      },
                      { value: "term-paper", label: "Term Paper" },
                      { value: "article-review", label: "Article Review" },
                      { value: "creative-writing", label: "Creative Writing" },
                      {
                        value: "reflective-writing",
                        label: "Reflective Writing",
                      },
                      { value: "dissertation", label: "Dissertation" },
                      { value: "thesis", label: "Thesis" },
                      {
                        value: "movie-and-book-review",
                        label: "Move/Book Review",
                      },
                      { value: "thinking", label: "Critical Thinking" },
                      { value: "report", label: "Report" },
                      { value: "editing", label: "Editing & Proofreading" },
                      { value: "math-problems", label: "Mathematics Problems" },
                    ]}
                    required
                  />
                  <FormField
                    label="Writer level"
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
                    label="Pages/Slides"
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
                    label="Spacing"
                    name="spacing"
                    type="select"
                    value={formData.spacing}
                    onChange={handleInputChange}
                    options={[
                      { value: "double", label: "Double-spaced" },
                      { value: "single", label: "Single-spaced" },
                    ]}
                    required
                  />
                  <FormField
                    label="Paper Format"
                    name="paper_format"
                    type="select"
                    value={formData.paper_format}
                    onChange={handleInputChange}
                    options={[
                      { value: "", label: "Paper Format" },
                      { value: "none", label: "None" },
                      { value: "apa", label: "APA" },
                      { value: "mla", label: "MLA" },
                      { value: "chicago", label: "Chicago" },
                      { value: "harvard", label: "Harvard" },
                      { value: "turabian", label: "Turabian" },
                      { value: "ieee", label: "IEEE" },
                      { value: "asa", label: "ASA" },
                      { value: "ama", label: "AMA" },
                      { value: "cms", label: "CMS (Chicago Manual of Style)" },
                      {
                        value: "cse",
                        label: "CSE (Council of Science Editors)",
                      },
                      { value: "bluebook", label: "Bluebook" },
                      { value: "oscola", label: "OSCOLA" },
                      { value: "vancouver", label: "Vancouver" },
                    ]}
                    required
                  />
                  <FormField
                    label="Select English Type"
                    name="english_type"
                    type="select"
                    value={formData.english_type}
                    onChange={handleInputChange}
                    options={[
                      { value: "us", label: "US" },
                      { value: "uk", label: "UK" },
                    ]}
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
                    label="Number of sources"
                    name="number_of_sources"
                    type="select"
                    value={formData.number_of_sources.toString()}
                    onChange={handleInputChange}
                    options={Array.from({ length: 20 }, (_, i) => ({
                      value: `${i}`,
                      label: `${i}`,
                    }))}
                    required
                  />
                  <FormField
                    label="Deadline"
                    name="deadline"
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mt-6">
                  <label
                    htmlFor="topic"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Topic <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="topic"
                    name="topic"
                    type="text"
                    value={formData.topic}
                    onChange={(e) => handleInputChange("topic", e.target.value)}
                    placeholder="E.g. Topic"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors duration-200 bg-white placeholder-gray-400 text-gray-800 pr-10"
                  />
                </div>
                <div className="mt-6">
                  <label
                    htmlFor="instructions"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Instructions
                  </label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    value={formData.instructions}
                    onChange={(e) =>
                      handleInputChange("instructions", e.target.value)
                    }
                    placeholder="E.g. Detailed description of your order"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400  transition-colors duration-200 bg-white placeholder-gray-400 text-gray-800 min-h-32 resize-vertical"
                  />
                </div>
                <div className="mt-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload file
                  </label>

                  <label
                    htmlFor="file-upload"
                    className={`block border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
                      isDragOver
                        ? "border-slate-400 bg-slate-50"
                        : "border-gray-300 hover:border-slate-400 hover:bg-slate-50/50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <CloudUpload
                      className="mx-auto mb-4 text-gray-400"
                      size={48}
                    />
                    <p className="text-gray-600 mb-2">
                      Drag and Drop (or){" "}
                      <span className="text-slate-600 font-medium">
                        Choose Files
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Maximum file size:{" "}
                      <span className="font-medium">50MB</span> · Maximum
                      uploadable files: <span className="font-medium">20</span>
                    </p>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                  </label>

                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="text-gray-400" size={20} />
                            <span className="text-sm font-medium text-gray-700">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <FormField
                    label="Total Order Amount:"
                    name="total_price"
                    type="text"
                    value={`USD ${formData.total_price.toFixed(2)}`}
                    readonly
                    fullWidth
                  />
                </div>
              </div>
            </div>
            {/* Right - Summary */}
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
                        : "Custom Essay"}
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
                  className={`w-full flex items-center justify-center bg-gradient-to-r ${
                    isSubmitting
                      ? "from-slate-500 to-slate-700"
                      : "from-slate-800 to-slate-900"
                  } text-white py-4 rounded-xl cursor-pointer font-semibold hover:from-slate-900 hover:to-slate-950 transition-all duration-300 shadow-lg ${
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
    </div>
  );
}

export default NewOrder;
