import { useState, useEffect } from "react";
import { Check, CloudUpload, FileText, X, Tag } from "lucide-react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { endpoint } from "../../server";
import { useNavigate, useLocation } from "react-router-dom";
import { notify } from "../../utils/toast";
import Select from "react-select";

function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [steps, setSteps] = useState([
    {
      number: 1,
      title: "Assignment Instructions",
      current: false,
      completed: true,
    },
    { number: 2, title: "Order Confirmation", current: true, completed: false },
    { number: 3, title: "Order Payment", current: false, completed: false },
  ]);
  const [formData, setFormData] = useState({
    order_id: null,
    type_of_service: "writing",
    english_type: "",
    subject: "",
    topic: "",
    instructions: "",
    uploadedFiles: [],
    writer_category: "standard",
    number_of_sources: 0,
    charts_graphs: 0,
    paper_format: "",
    number_of_words: 0,
    spacing: "double",
    plagiarism_report: false,
    writer_tip: "",
    payment_option: "full",
    coupon_code: "",
    total_price: 0,
    initial_total_price: 0,
    checkout_amount: 0,
    document_type: "",
    writer_level: "",
    pages: "",
    deadline: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState(null);

  // Load data from localStorage and location.state
  useEffect(() => {
    const step1 = JSON.parse(localStorage.getItem("step1Data")) || {};
    const step2 = JSON.parse(localStorage.getItem("step2Data")) || {};
    const orderId =
      localStorage.getItem("order_id") || location.state?.order_id || null;
    const merged = { ...step1, ...step2 };
    const initialTotalPrice = parseFloat(merged.total_price) || 0;

    setFormData((prev) => ({
      ...prev,
      order_id: orderId,
      english_type: merged.english_type || "US",
      type_of_service: merged.type_of_service || "writing",
      subject: merged.subject || "",
      topic: merged.topic || "",
      instructions: merged.instructions || "",
      writer_category: merged.writer_category || "standard",
      number_of_words: parseInt(merged.number_of_words) || 0,
      number_of_sources: parseInt(merged.number_of_sources) || 0,
      powerpoint_slides: parseInt(merged.powerpoint_slides) || 0,
      charts_graphs: parseInt(merged.charts_graphs) || 0,
      paper_format: merged.paper_format || "",
      spacing: merged.spacing || "double",
      plagiarism_report: merged.plagiarism_report || false,
      writer_tip: merged.writer_tip || "",
      payment_option: merged.payment_option || "full",
      coupon_code: merged.coupon_code || "",
      initial_total_price: initialTotalPrice,
      total_price: merged.total_price || initialTotalPrice,
      checkout_amount: initialTotalPrice * 1.06,
      document_type: merged.document_type || "",
      writer_level: merged.writer_level || "",
      pages: merged.pages || "",
      deadline: merged.deadline || "",
      uploadedFiles: Array.isArray(merged.uploadedFiles)
        ? merged.uploadedFiles.map((file) => ({
            name: file.name,
            size: file.size,
            file: null,
          }))
        : [],
    }));
  }, [location.state]);

  // Price calculation
  useEffect(() => {
    const calculatePrice = () => {
      let total = parseFloat(formData.initial_total_price) || 0;
      const tip = parseFloat(formData.writer_tip) || 0;

      if (!isNaN(tip) && tip >= 0) total += tip;
      if (formData.plagiarism_report) total += 6;
      if (formData.writer_category === "advanced") total += 5;
      else if (formData.writer_category === "premium") total += 10;
      total += (parseInt(formData.number_of_sources) || 0) * 1.99;
      total += (parseInt(formData.powerpoint_slides) || 0) * 8;
      total += (parseInt(formData.charts_graphs) || 0) * 8;
      if (formData.spacing === "single") total *= 2;

      const finalTotal = formData.payment_option === "half" ? total / 2 : total;
      const checkoutAmount = finalTotal * 1.06;

      setFormData((prev) => ({
        ...prev,
        total_price: parseFloat(finalTotal.toFixed(2)),
        checkout_amount: parseFloat(checkoutAmount.toFixed(2)),
      }));
    };
    calculatePrice();
  }, [
    formData.initial_total_price,
    formData.writer_tip,
    formData.plagiarism_report,
    formData.writer_category,
    formData.spacing,
    formData.powerpoint_slides,
    formData.charts_graphs,
    formData.number_of_sources,
    formData.payment_option,
  ]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle select and custom changes
  const handleCustomChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload events
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
    if (files.length + formData.uploadedFiles.length > 20) {
      notify.error("Cannot upload more than 20 files.");
      return;
    }
    if (files.some((file) => file.size > 50 * 1024 * 1024)) {
      notify.error("Each file must be under 50MB.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      uploadedFiles: [
        ...prev.uploadedFiles,
        ...files.map((file) => ({ name: file.name, size: file.size, file })),
      ],
    }));
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + formData.uploadedFiles.length > 20) {
        notify.error("Cannot upload more than 20 files.");
        return;
      }
      if (files.some((file) => file.size > 50 * 1024 * 1024)) {
        notify.error("Each file must be under 50MB.");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        uploadedFiles: [
          ...prev.uploadedFiles,
          ...files.map((file) => ({ name: file.name, size: file.size, file })),
        ],
      }));
    }
  };

  const removeFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index),
    }));
  };

  // Form submission
  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!isDraft) {
      const requiredFields = [
        "subject",
        "topic",
        "writer_category",
        "paper_format",
      ];
      const missingFields = requiredFields.filter((field) => !formData[field]);
      if (missingFields.length > 0) {
        notify.error(
          `Please fill all required fields: ${missingFields.join(", ")}`
        );
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const orderData = {
        order_id: formData.order_id || undefined,
        english_type: formData.english_type,
        type_of_service: formData.type_of_service || "writing",
        subject: formData.subject,
        topic: formData.topic,
        instructions: formData.instructions,
        writer_category: formData.writer_category,
        number_of_sources: parseInt(formData.number_of_sources) || 0,
        paper_format: formData.paper_format,
        spacing: formData.spacing,
        plagiarism_report: formData.plagiarism_report,
        writer_tip:
          formData.writer_tip === ""
            ? null
            : parseFloat(formData.writer_tip) || 0,
        payment_option: formData.payment_option,
        coupon_code: formData.coupon_code,
        total_price: formData.total_price,
        checkout_amount: formData.checkout_amount,
        document_type: formData.document_type,
        writer_level: formData.writer_level,
        pages: parseInt(formData.pages) || 1,
        number_of_words: parseInt(formData.number_of_words) || 0,
        deadline: formData.deadline,
        ...(isDraft && { order_status: "draft" }),
      };

      const payload = new FormData();
      Object.entries(orderData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          payload.append(key, value);
        }
      });
      formData.uploadedFiles.forEach((file) => {
        if (file.file) payload.append("uploadedFiles", file.file);
      });

      const response = await axios.post(
        `${endpoint}/orders/post-order`,
        payload,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      localStorage.setItem(
        "checkoutAmount",
        formData.checkout_amount.toString()
      );
      const fileMetadata = formData.uploadedFiles.map((f) => ({
        name: f.name,
        size: f.size,
      }));

      localStorage.setItem(
        "step2Data",
        JSON.stringify({ ...orderData, uploadedFiles: fileMetadata })
      );
      localStorage.setItem("order_id", response.data.order.order_id);

      notify.success(
        isDraft
          ? "Draft saved successfully."
          : formData.order_id
          ? "Order updated successfully."
          : "Order posted, awaiting payment."
      );

      if (!isDraft) {
        setSteps((prev) =>
          prev.map((step, index) =>
            index === 1
              ? { ...step, current: false, completed: true }
              : index === 2
              ? { ...step, current: true }
              : step
          )
        );
        navigate("/order-checkout", {
          state: { order_id: response.data.order.order_id },
        });
      }
    } catch (error) {
      console.error("Error submitting order:", error.response?.data || error);
      notify.error(
        "Failed to process order details: " +
          (error.response?.data?.error || error.message)
      );
      setError(error.response?.data?.error || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    navigate("/new-order");
  };

  // OptionCard component (reused from NewOrder)
  const OptionCard = ({ value, label, desc, selected, onClick }) => {
    return (
      <div
        onClick={onClick}
        className={`relative cursor-pointer p-4 transition duration-200 bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 rounded-lg shadow-sm border ${
          selected ? "border-teal-500 bg-teal-50" : "border-slate-200"
        }`}
      >
        <div className="text-sm font-medium text-slate-700">{label}</div>
        {desc && <p className="text-xs text-slate-500">{desc}</p>}
        {selected && (
          <Check className="absolute top-3 right-3 text-teal-500 w-5 h-5" />
        )}
      </div>
    );
  };

  // SelectField component for react-select
  const SelectField = ({ label, name, value, onChange, options, required }) => {
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
      singleValue: (provided) => ({
        ...provided,
        color: "#1e293b",
      }),
      placeholder: (provided) => ({
        ...provided,
        color: "#94a3b8",
      }),
    };

    return (
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <Select
          value={options.find((option) => option.value === value) || null}
          onChange={(selected) =>
            onChange(name, selected ? selected.value : "")
          }
          options={options}
          styles={selectStyles}
          isSearchable={true}
          placeholder={`Select ${label.toLowerCase()}`}
        />
      </div>
    );
  };

  const formatDeadline = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "Not set";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          {/* Progress Tracker */}
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

          {/* Order Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">
                  Order Confirmation
                </h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Subject */}
                  <SelectField
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleCustomChange}
                    options={[
                      { value: "", label: "Select subject" },
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
                  {/* Topic */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Topic <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="topic"
                      name="topic"
                      type="text"
                      value={formData.topic}
                      onChange={handleChange}
                      placeholder="Enter your topic"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  {/* Instructions */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Instructions
                    </label>
                    <textarea
                      id="instructions"
                      name="instructions"
                      value={formData.instructions}
                      onChange={handleChange}
                      placeholder="Provide detailed instructions"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent min-h-32 resize-vertical"
                    />
                  </div>
                  {/* File Attachment */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Upload File
                    </label>
                    {formData.uploadedFiles.length === 0 ? (
                      <label
                        htmlFor="file-upload"
                        className={`block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                          isDragOver
                            ? "border-teal-500 bg-teal-50"
                            : "border-slate-200 hover:border-teal-500 hover:bg-teal-50/50"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <CloudUpload
                          className="mx-auto mb-4 text-slate-500"
                          size={48}
                        />
                        <p className="text-slate-600 mb-2">
                          Drag and Drop or{" "}
                          <span className="text-teal-600 font-medium underline">
                            Choose Files
                          </span>
                        </p>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileSelect}
                          className="hidden"
                          id="file-upload"
                        />
                      </label>
                    ) : (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          {formData.uploadedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200"
                            >
                              <div className="flex items-center space-x-3">
                                <FileText
                                  className="text-slate-500"
                                  size={20}
                                />
                                <span className="text-sm font-medium text-slate-700">
                                  {file.name}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {(file.size / 1024).toFixed(1)} KB
                                </span>
                              </div>
                              <button
                                onClick={() => removeFile(index)}
                                className="text-red-600 hover:text-red-700"
                                title="Remove"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <label
                          htmlFor="file-upload"
                          className="inline-flex items-center px-4 py-2 bg-slate-100 hover:bg-teal-50 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg cursor-pointer transition"
                        >
                          <CloudUpload
                            className="mr-2 text-slate-500"
                            size={16}
                          />
                          Add More Files
                          <input
                            type="file"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  {/* Spacing */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Spacing <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { value: "double", label: "Double Spaced" },
                        { value: "single", label: "Single Spaced" },
                      ].map((option) => (
                        <OptionCard
                          key={option.value}
                          value={option.value}
                          label={option.label}
                          selected={formData.spacing === option.value}
                          onClick={() =>
                            handleCustomChange("spacing", option.value)
                          }
                        />
                      ))}
                    </div>
                  </div>
                  {/* Paper Format */}
                  <SelectField
                    label="Paper Format"
                    name="paper_format"
                    value={formData.paper_format}
                    onChange={handleCustomChange}
                    options={[
                      { value: "", label: "Select format" },
                      { value: "none", label: "None" },
                      { value: "apa", label: "APA" },
                      { value: "mla", label: "MLA" },
                      { value: "chicago", label: "Chicago" },
                      { value: "harvard", label: "Harvard" },
                      { value: "turabian", label: "Turabian" },
                      { value: "ieee", label: "IEEE" },
                    ]}
                    required
                  />
                  {/* Writer's Category */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Writer's Category <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        {
                          value: "standard",
                          label: "Standard",
                          desc: "Standard quality, reliable delivery",
                        },
                        {
                          value: "advanced",
                          label: "Advanced",
                          desc: "Experienced writer, enhanced quality",
                        },
                        {
                          value: "premium",
                          label: "Premium",
                          desc: "Top-tier writer, premium quality",
                        },
                      ].map((option) => (
                        <OptionCard
                          key={option.value}
                          value={option.value}
                          label={option.label}
                          desc={option.desc}
                          selected={formData.writer_category === option.value}
                          onClick={() =>
                            handleCustomChange("writer_category", option.value)
                          }
                        />
                      ))}
                    </div>
                  </div>
                  {/* Additional Requirements */}
                  <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4">
                      Additional Requirements
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Sources */}
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">
                          Sources{" "}
                          <span className="text-slate-400 text-xs">
                            ($1.99 each)
                          </span>
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {Array.from({ length: 6 }, (_, i) => (
                            <OptionCard
                              key={i}
                              value={i}
                              label={`${i}`}
                              selected={formData.number_of_sources === i}
                              onClick={() =>
                                handleCustomChange("number_of_sources", i)
                              }
                            />
                          ))}
                        </div>
                      </div>
                      {/* Slides */}
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">
                          Slides{" "}
                          <span className="text-slate-400 text-xs">
                            ($8 each)
                          </span>
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {Array.from({ length: 6 }, (_, i) => (
                            <OptionCard
                              key={i}
                              value={i}
                              label={`${i}`}
                              selected={formData.powerpoint_slides === i}
                              onClick={() =>
                                handleCustomChange("powerpoint_slides", i)
                              }
                            />
                          ))}
                        </div>
                      </div>
                      {/* Graphs */}
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">
                          Charts/Graphs{" "}
                          <span className="text-slate-400 text-xs">
                            ($8 each)
                          </span>
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {Array.from({ length: 6 }, (_, i) => (
                            <OptionCard
                              key={i}
                              value={i}
                              label={`${i}`}
                              selected={formData.charts_graphs === i}
                              onClick={() =>
                                handleCustomChange("charts_graphs", i)
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Plagiarism Report */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Plagiarism Report
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { value: true, label: "Include" },
                        { value: false, label: "Do not include" },
                      ].map((option) => (
                        <OptionCard
                          key={option.value}
                          value={option.value}
                          label={option.label}
                          selected={formData.plagiarism_report === option.value}
                          onClick={() =>
                            handleCustomChange(
                              "plagiarism_report",
                              option.value
                            )
                          }
                        />
                      ))}
                    </div>
                  </div>
                  {/* Writer's Tip */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Writer's Tip
                    </label>
                    <input
                      id="writer_tip"
                      name="writer_tip"
                      type="number"
                      value={formData.writer_tip}
                      onChange={handleChange}
                      placeholder="Enter tip in USD"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                  {/* Payment Option */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Payment Option <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { value: "full", label: "Pay in Full" },
                        { value: "half", label: "Pay Half Now" },
                      ].map((option) => (
                        <OptionCard
                          key={option.value}
                          value={option.value}
                          label={option.label}
                          selected={formData.payment_option === option.value}
                          onClick={() =>
                            handleCustomChange("payment_option", option.value)
                          }
                        />
                      ))}
                    </div>
                  </div>
                  {/* Coupon Code */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Coupon Code
                    </label>
                    <div className="relative">
                      <Tag
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500"
                        size={20}
                      />
                      <input
                        id="coupon_code"
                        name="coupon_code"
                        type="text"
                        value={formData.coupon_code}
                        onChange={handleChange}
                        placeholder="Enter coupon code"
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between gap-3">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="w-1/2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-3 rounded-xl cursor-pointer"
                    >
                      Previous
                    </button>
                    <button
                      onClick={(e) => handleSubmit(e)}
                      disabled={isSubmitting}
                      className={`w-1/2 flex items-center justify-center cursor-pointer bg-gradient-to-r ${
                        isSubmitting
                          ? "from-slate-400 to-slate-600"
                          : "from-teal-500 to-teal-700"
                      } text-white py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-teal-800 ${
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
                </form>
              </div>
            </div>
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-20">
                <h3 className="text-xl font-bold text-slate-800 mb-6">
                  Summary
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subject</span>
                    <span className="font-semibold">
                      {formData.subject
                        ? formData.subject.charAt(0).toUpperCase() +
                          formData.subject.slice(1)
                        : "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Document Type</span>
                    <span className="font-semibold capitalize">
                      {formData.document_type || "Essay"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">English Type</span>
                    <span className="font-semibold capitalize">
                      {(formData.english_type || "USA").toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Quantity</span>
                    <span className="font-semibold">
                      {formData.pages || 1} Page
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Words</span>
                    <span className="font-semibold">
                      {formData.number_of_words || 275} Words
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Academic Level</span>
                    <span className="font-semibold capitalize">
                      {formData.writer_level || "University"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Deadline</span>
                    <span className="font-semibold text-sm">
                      {formatDeadline(formData.deadline)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Writer Category</span>
                    <span className="font-semibold capitalize">
                      {formData.writer_category || "Standard"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Spacing</span>
                    <span className="font-semibold capitalize">
                      {formData.spacing
                        ? formData.spacing.charAt(0).toUpperCase() +
                          formData.spacing.slice(1) +
                          " Spaced"
                        : "Double Spaced"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Paper Format</span>
                    <span className="font-semibold">
                      {(formData.paper_format || "None").toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Sources</span>
                    <span className="font-semibold">
                      {formData.number_of_sources || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">PowerPoint Slides</span>
                    <span className="font-semibold">
                      {formData.powerpoint_slides || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Charts & Graphs</span>
                    <span className="font-semibold">
                      {formData.charts_graphs || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Plagiarism Report</span>
                    <span className="font-semibold">
                      {formData.plagiarism_report ? "Included" : "Not included"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Writer's Tip</span>
                    <span className="font-semibold">
                      {formData.writer_tip === ""
                        ? "Not included"
                        : `$${parseFloat(formData.writer_tip || 0).toFixed(2)}`}
                    </span>
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-4 mb-6 space-y-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${(formData.total_price || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-slate-800 pt-2">
                    <span>Checkout Amount</span>
                    <span>${(formData.checkout_amount || 0).toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-slate-500 text-right italic">
                    Inclusive of 6% processing fee
                  </p>
                </div>
                <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                  <p className="text-sm text-slate-600 mb-3">
                    Not ready to finish up right now? No worries.
                  </p>
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, true)}
                    className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 hover:bg-teal-50 font-medium px-4 py-2 text-sm rounded-lg transition cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Save as Draft
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

export default OrderConfirmation;
