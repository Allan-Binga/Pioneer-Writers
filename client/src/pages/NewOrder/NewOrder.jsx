import { Navigate } from "react-router-dom";
import Select from "react-select";
import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import { Check, CloudUpload, X, FileText, ChevronDown } from "lucide-react";

function NewOrder() {
  const [formData, setFormData] = useState({
    topic: "",
    documentType: "",
    writerLevel: "",
    paperFormat: "",
    spacing: "double",
    wordCount: 275,
    sources: 1,
    englishType: "",
    instructions: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const steps = [
    { number: 1, title: "Assignment Instructions", current: true },
    { number: 2, title: "Order Payment", completed: false },
    { number: 3, title: "Order Confirmation", completed: false },
  ];
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
        "&:hover": {
          borderColor: "#7C3AED",
        },
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
        "&:hover": {
          backgroundColor: "#F3E8FF",
          color: "#1F2937",
        },
      }),
      singleValue: (provided) => ({
        ...provided,
        color: "#1F2937",
      }),
      placeholder: (provided) => ({
        ...provided,
        color: "#9CA3AF",
      }),
      dropdownIndicator: (provided) => ({
        ...provided,
        color: "#7C3AED",
        "&:hover": {
          color: "#6B21A8",
        },
      }),
      indicatorSeparator: () => ({
        display: "none",
      }),
    };

    return (
      <div className={fullWidth ? "col-span-full" : ""}>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
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
              components={{
                DropdownIndicator: () => (
                  <ChevronDown className="text-purple-600 mx-2" size={20} />
                ),
              }}
            />
          ) : type === "textarea" ? (
            <textarea
              value={value}
              onChange={(e) => onChange(name, e.target.value)}
              placeholder={placeholder}
              className={`${baseInputClasses} ${
                readonly ? readonlyClasses : ""
              } min-h-32 resize-vertical`}
              readOnly={readonly}
            />
          ) : (
            <div className="relative">
              <input
                type={type}
                value={value}
                onChange={(e) =>
                  onChange(
                    name,
                    type === "number"
                      ? parseInt(e.target.value) || 0
                      : e.target.value
                  )
                }
                placeholder={placeholder}
                className={`${baseInputClasses} ${
                  readonly ? readonlyClasses : ""
                } pr-10`}
                readOnly={readonly}
              />
              {(type === "text" || type === "number") && !suffix && (
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600"
                  size={20}
                />
              )}
              {suffix && (
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  {suffix}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Progress Tracker */}
          <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 mb-8">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200 z-0">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                  style={{ width: "33%" }}
                />
              </div>

              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center relative z-10"
                >
                  <div
                    className={`
              w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
              ${
                step.completed
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 border-purple-500 text-white"
                  : step.current
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 border-purple-500 text-white shadow-lg"
                  : "bg-white border-gray-300 text-gray-400"
              }
            `}
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
                    className={`
              mt-2 text-sm font-medium text-center
              ${step.current ? "text-purple-600" : "text-gray-600"}
            `}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Assignment Form and Summary Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-purple-200 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Step 1: Assignment Instructions
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Topic Field"
                    name="topic"
                    type="select"
                    value={formData.topic}
                    onChange={handleInputChange}
                    options={[
                      { value: "", label: "Topic Field" },
                      { value: "art", label: "Art" },
                      { value: "architecture", label: "Architecture" },
                      { value: "dance", label: "Dance" },
                      { value: "design_analysis", label: "Design Analysis" },
                      { value: "drama", label: "Drama" },
                      { value: "movies", label: "Movies" },
                      { value: "music", label: "Music" },
                      { value: "paintings", label: "Paintings" },
                      { value: "theatre", label: "Theatre" },
                      { value: "biology", label: "Biology" },
                      { value: "business", label: "Business" },
                      { value: "chemistry", label: "Chemistry" },
                      { value: "philosophy", label: "Philosophy" },
                      {
                        value: "media_communication",
                        label: "Media and Communication",
                      },
                      { value: "advertising", label: "Advertising" },
                      {
                        value: "communication_strategies",
                        label: "Communication Strategies",
                      },
                      { value: "journalism", label: "Journalism" },
                      { value: "public_relations", label: "Public Relations" },
                      { value: "creative_writing", label: "Creative Writing" },
                      { value: "economics", label: "Economics" },
                      {
                        value: "economics_accounting",
                        label: "Economics Accounting",
                      },
                      {
                        value: "economics_case_study",
                        label: "Economics Case Study",
                      },
                      { value: "company_analysis", label: "Company Analysis" },
                      { value: "ecommerce", label: "E-commerce" },
                      {
                        value: "economics_finance",
                        label: "Economics Finance",
                      },
                      { value: "investments", label: "Investments" },
                      { value: "logistics", label: "Logistics" },
                      { value: "trade", label: "Trade" },
                      { value: "education", label: "Education" },
                      {
                        value: "application_essay",
                        label: "Application Essay",
                      },
                      {
                        value: "education_theories",
                        label: "Education Theories",
                      },
                      { value: "engineering", label: "Engineering" },
                      { value: "english", label: "English" },
                      { value: "ethics", label: "Ethics" },
                      { value: "history", label: "History" },
                      {
                        value: "african_american_studies",
                        label: "African American Studies",
                      },
                      { value: "american_history", label: "American History" },
                      { value: "law", label: "Law" },
                    ]}
                    required
                  />

                  <FormField
                    label="Type of Service"
                    name="serviceType"
                    type="select"
                    value="writing"
                    onChange={handleInputChange}
                    options={[
                      { value: "writing", label: "Writing from scratch" },
                      { value: "re-writing", label: "Re-writing" },
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
                    name="documentType"
                    type="select"
                    value={formData.documentType}
                    onChange={handleInputChange}
                    options={[
                      { value: "", label: "Document type" },
                      { value: "essay", label: "Essay" },
                      { value: "research-paper", label: "Research Paper" },
                      { value: "thesis", label: "Thesis" },
                      { value: "dissertation", label: "Dissertation" },
                      {
                        value: "annotated-bibliography",
                        label: "Annotated Bibliography",
                      },
                      {
                        value: "literature-review",
                        label: "Literature Review",
                      },
                      { value: "reflection-essay", label: "Reflection Essay" },
                      { value: "report", label: "Report" },
                      { value: "case-study", label: "Case Study" },
                      { value: "book-review", label: "Book/Movie Review" },
                      {
                        value: "multiple-choice-questions",
                        label: "Multiple Choice Questions",
                      },
                      { value: "editing", label: "Editing & Proofreading" },
                      { value: "math-problems", label: "Mathematics Problems" },
                    ]}
                    required
                  />

                  <FormField
                    label="Writer level"
                    name="writerLevel"
                    type="select"
                    value={formData.writerLevel}
                    onChange={handleInputChange}
                    options={[
                      { value: "", label: "University" },
                      { value: "high-school", label: "High School" },
                      { value: "university", label: "University" },
                      { value: "masters", label: "Masters" },
                      { value: "phd", label: "PhD" },
                    ]}
                    required
                  />

                  <FormField
                    label="Pages/Slides"
                    name="pages"
                    type="select"
                    value="1"
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
                      { value: "single", label: "Single-spaced" },
                      { value: "double", label: "Double-spaced" },
                    ]}
                    required
                  />

                  <FormField
                    label="Paper Format"
                    name="paperFormat"
                    type="select"
                    value={formData.paperFormat}
                    onChange={handleInputChange}
                    options={[
                      { value: "", label: "Paper Format:" },
                      { value: "apa", label: "APA" },
                      { value: "mla", label: "MLA" },
                      { value: "chicago", label: "Chicago" },
                      { value: "harvard", label: "Harvard" },
                      { value: "turabian", label: "Turabian" },
                      { value: "oscola", label: "Oscola" },
                      { value: "oxford", label: "Oxford" },
                      { value: "vancouver", label: "Vancouver" },
                    ]}
                    required
                  />

                  <FormField
                    label="Select English Type"
                    name="englishType"
                    type="select"
                    value={formData.englishType}
                    onChange={handleInputChange}
                    options={[
                      { value: "", label: "US" },
                      { value: "us", label: "US" },
                      { value: "uk", label: "UK" },
                    ]}
                    required
                  />

                  <FormField
                    label="Number of Words"
                    name="wordCount"
                    type="number"
                    value={formData.wordCount}
                    onChange={handleInputChange}
                    suffix="Words"
                  />

                  <FormField
                    label="Number of sources"
                    name="sources"
                    type="select"
                    value={formData.sources.toString()}
                    onChange={handleInputChange}
                    options={Array.from({ length: 20 }, (_, i) => ({
                      value: `${i}`,
                      label: `${i}`,
                    }))}
                    required
                  />
                </div>

                <div className="mt-6">
                  <FormField
                    label="Topic"
                    name="topicField"
                    type="text"
                    value=""
                    onChange={handleInputChange}
                    placeholder="E.g. Topic"
                    fullWidth
                  />
                </div>

                <div className="mt-6">
                  <FormField
                    label="Instructions"
                    name="instructions"
                    type="textarea"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    placeholder="E.g. Detailed description of your order"
                    fullWidth
                  />
                </div>

                <div className="mt-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload file
                  </label>
                  <div
                    className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
            ${
              isDragOver
                ? "border-purple-400 bg-purple-50"
                : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/50"
            }
          `}
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
                      <span className="text-purple-600 font-medium cursor-pointer">
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
                    <label
                      htmlFor="file-upload"
                      className="text-purple-600 font-medium cursor-pointer hover:text-purple-700 transition-colors"
                    >
                      Choose Files
                    </label>
                  </div>

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
                    name="totalAmount"
                    type="text"
                    value="USD 20.00"
                    onChange={handleInputChange}
                    readonly
                    fullWidth
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Without the File processing fee
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              {/* <SummarySidebar /> */}
              <div>
                <div className="space-y-6">
                  {/* Summary Card */}
                  <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 sticky top-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">
                      Summary
                    </h3>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Essay</span>
                        <span className="font-semibold">$16</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Quantity</span>
                        <span className="font-semibold">1 page</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Academic Level</span>
                        <span className="font-semibold">Undergraduate</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Deadline</span>
                        <span className="font-semibold text-sm">
                          by 10:07 PM - July 3 (14 days)
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Basic writer</span>
                        <span className="font-semibold"></span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-6">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total</span>
                        <span>$16.00</span>
                      </div>
                    </div>

                    {/* <div className="flex items-center space-x-2 mb-6">
                    <input
                      type="checkbox"
                      id="promocode"
                      className="rounded border-gray-300"
                    />
                    <label
                      htmlFor="promocode"
                      className="text-sm text-gray-600"
                    >
                      Use promocode
                    </label>
                  </div> */}

                    <button className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white py-4 rounded-xl font-semibold hover:from-slate-900 hover:to-slate-950 transition-all duration-200 shadow-lg ">
                      Next
                    </button>
                  </div>

                  {/* <FreebiesSection /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default NewOrder;
