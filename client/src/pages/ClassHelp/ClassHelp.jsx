import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useState, useEffect, useCallback } from "react";
import { Check, CloudUpload, FileText, X } from "lucide-react";
import { notify } from "../../utils/toast";
import axios from "axios";
import { endpoint } from "../../server";

function ClassHelp() {
  const navigate = useNavigate();
  const [isDragOver, setIsDragOver] = useState(false);
  const [classData, setClassData] = useState({
    subject: "",
    course_code: "",
    academic_level: "undergraduate",
    week_range: "",
    budget: "",
    login_url: "",
    login_username: "",
    login_password: "",
    notes: "",
    uploadedSyllabus: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [steps, setSteps] = useState([
    {
      number: 1,
      title: "Class Order Instructions",
      current: true,
      completed: false,
    },
    {
      number: 2,
      title: "Class Payment",
      current: false,
      completed: false,
    },
  ]);

  // Load saved data from localStorage
  useEffect(() => {
    const storedClassOrder =
      JSON.parse(localStorage.getItem("classStep1Data")) || {};
    setClassData((prev) => ({
      ...prev,
      subject: storedClassOrder.subject || "",
      course_code: storedClassOrder.course_code || "",
      academic_level: storedClassOrder.academic_level || "undergraduate",
      week_range: storedClassOrder.week_range || "",
      budget: storedClassOrder.budget || "",
      login_url: storedClassOrder.login_url || "",
      login_username: storedClassOrder.login_username || "",
      login_password: storedClassOrder.login_password || "",
      notes: storedClassOrder.notes || "",
      uploadedSyllabus: storedClassOrder.uploadedSyllabus || null,
    }));
  }, []);

  // Handle input changes
  const handleInputChange = useCallback((name, value) => {
    setClassData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setClassData((prevData) => ({
      ...prevData,
      uploadedSyllabus: file || null,
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

  const handleDropSyllabus = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0]; // take only the first
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      notify.error("File must be under 50MB.");
      return;
    }

    setClassData((prev) => ({
      ...prev,
      uploadedSyllabus: { name: file.name, size: file.size, file },
    }));
  };

  const removeSyllabus = () => {
    setClassData((prev) => ({
      ...prev,
      uploadedSyllabus: null,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const requiredFields = [
      "subject",
      "course_code",
      "academic_level",
      "week_range",
      "budget",
      "login_url",
      "login_username",
      "login_password",
    ];
    const missingFields = requiredFields.filter((field) => !classData[field]);
    if (missingFields.length > 0) {
      notify.error(
        `Please fill all required fields: ${missingFields.join(", ")}`
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("subject", classData.subject);
      formData.append("course_code", classData.course_code);
      formData.append("academic_level", classData.academic_level);
      formData.append("week_range", classData.week_range);
      formData.append("budget", parseFloat(classData.budget).toFixed(2));
      formData.append("login_url", classData.login_url);
      formData.append("login_username", classData.login_username);
      formData.append("login_password", classData.login_password);
      formData.append("notes", classData.notes || "");
      if (classData.uploadedSyllabus) {
        formData.append("uploadedSyllabus", classData.uploadedSyllabus);
      }

      const response = await axios.post(
        `${endpoint}/classes/post/class/order`,

        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      const classOrderData = {
        ...classData,
        class_help_id: response.data.classOrder.class_help_id,
        budget: parseFloat(classData.budget).toFixed(2),
        uploadedSyllabus: response.data.classOrder.uploaded_syllabus || null,
      };

      localStorage.setItem("classStep1Data", JSON.stringify(classOrderData));
      notify.success("Class help order saved successfully");
      setSteps((prev) =>
        prev.map((step, index) =>
          index === 0
            ? { ...step, current: false, completed: true }
            : { ...step, current: true }
        )
      );
      navigate("/class-checkout", { state: { classOrder: classOrderData } });
    } catch (error) {
      notify.error(
        error.response?.data?.error || "Failed to submit class order"
      );
    } finally {
      setIsSubmitting(false);
    }
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

  // Format academic level for display
  const formatAcademicLevel = (level) =>
    level
      ? level
          .replace(/[-_]/g, " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "Undergraduate";

  // react-select custom styles
  const selectStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid #e2e8f0",
      borderRadius: "0.5rem",
      padding: "0.375rem",
      fontSize: "0.875rem",
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
      fontSize: "0.875rem",
      padding: "0.5rem 0.75rem",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      border: "1px solid #e2e8f0",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      fontSize: "0.875rem",
    }),
  };

  // Options for academic level
  const academicLevelOptions = [
    { value: "undergraduate", label: "Undergraduate" },
    { value: "graduate", label: "Graduate" },
    { value: "masters", label: "Masters" },
    { value: "doctoral", label: "Doctoral" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Animated Background Waves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (Form) */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-8">
                <h2 className="text-xl font-bold text-slate-800 mb-6">
                  Class Description
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Discipline <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={classData.subject}
                      onChange={(e) =>
                        handleInputChange("subject", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      placeholder="e.g., Computer Security"
                    />
                  </div>

                  {/* Course Code */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Course Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="course_code"
                      value={classData.course_code}
                      onChange={(e) =>
                        handleInputChange("course_code", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      placeholder="e.g., CSY101"
                    />
                  </div>

                  {/* Academic Level */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Academic Level <span className="text-red-500">*</span>
                    </label>
                    <Select
                      name="academic_level"
                      value={academicLevelOptions.find(
                        (opt) => opt.value === classData.academic_level
                      )}
                      onChange={(option) =>
                        handleInputChange("academic_level", option.value)
                      }
                      options={academicLevelOptions}
                      styles={selectStyles}
                      placeholder="Select academic level"
                    />
                  </div>

                  {/* Week Range */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Week Range <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="week_range"
                      value={classData.week_range}
                      onChange={(e) =>
                        handleInputChange("week_range", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      placeholder="e.g., Week 1-5"
                    />
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Budget ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="budget"
                      value={classData.budget}
                      onChange={(e) =>
                        handleInputChange("budget", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      placeholder="e.g., 200.00"
                      step="0.01"
                    />
                  </div>

                  {/* Login URL */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Login URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      name="login_url"
                      value={classData.login_url}
                      onChange={(e) =>
                        handleInputChange("login_url", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      placeholder="e.g., https://portal.university.edu"
                    />
                  </div>

                  {/* Login Username */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Login Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="login_username"
                      value={classData.login_username}
                      onChange={(e) =>
                        handleInputChange("login_username", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      placeholder="e.g., username"
                    />
                  </div>

                  {/* Login Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Login Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="login_password"
                      value={classData.login_password}
                      onChange={(e) =>
                        handleInputChange("login_password", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      placeholder="e.g., password"
                    />
                  </div>

                  {/* Notes */}
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      name="notes"
                      value={classData.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      rows="4"
                      placeholder="Any additional instructions or details"
                    />
                  </div>

                  {/* File Upload */}
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Upload Syllabus
                    </label>

                    {!classData.uploadedSyllabus ? (
                      // Show drag-and-drop / choose file box
                      <label
                        htmlFor="syllabus-upload"
                        className={`block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                          isDragOver
                            ? "border-teal-500 bg-teal-50"
                            : "border-slate-200 hover:border-teal-500 hover:bg-teal-50/50"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDropSyllabus}
                      >
                        <CloudUpload
                          className="mx-auto mb-4 text-slate-500"
                          size={48}
                        />
                        <p className="text-slate-600 mb-2 text-sm">
                          Drag and Drop or{" "}
                          <span className="text-teal-600 font-medium underline">
                            Choose File
                          </span>
                        </p>
                        <input
                          type="file"
                          id="syllabus-upload"
                          name="uploadedSyllabus"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      // Show selected file details
                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <div className="flex items-center space-x-3">
                            <FileText className="text-slate-500" size={20} />
                            <span className="text-sm font-medium text-slate-700">
                              {classData.uploadedSyllabus.name}
                            </span>
                            <span className="text-xs text-slate-500">
                              {(classData.uploadedSyllabus.size / 1024).toFixed(
                                1
                              )}{" "}
                              KB
                            </span>
                          </div>
                          <button
                            onClick={() => removeSyllabus()}
                            className="text-red-600 hover:text-red-700"
                            title="Remove"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        {/* Replace File button */}
                        <label
                          htmlFor="syllabus-upload"
                          className="inline-flex items-center px-4 py-2 bg-slate-100 hover:bg-teal-50 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg cursor-pointer transition"
                        >
                          <CloudUpload
                            className="mr-2 text-slate-500"
                            size={16}
                          />
                          Replace File
                          <input
                            type="file"
                            id="syllabus-upload"
                            name="uploadedSyllabus"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Summary) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 lg:sticky lg:top-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6">
                  Summary
                </h3>
                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Discipline</span>
                    <span className="font-semibold">
                      {classData.subject || "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Course Code</span>
                    <span className="font-semibold">
                      {classData.course_code || "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Academic Level</span>
                    <span className="font-semibold">
                      {formatAcademicLevel(classData.academic_level)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Week Range</span>
                    <span className="font-semibold">
                      {classData.week_range || "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Budget</span>
                    <span className="font-semibold">
                      {classData.budget
                        ? `$${parseFloat(classData.budget).toFixed(2)}`
                        : "Not set"}
                    </span>
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-4 mb-6">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>
                      {classData.budget
                        ? `$${parseFloat(classData.budget).toFixed(2)}`
                        : "$0.00"}
                    </span>
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

export default ClassHelp;
