import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  CheckCircle,
  BookOpen,
  Users,
  Shield,
  ChevronDown,
} from "lucide-react";
import GoogleIcon from "../../assets/google.png";
import FacebookIcon from "../../assets/facebook.png";
import AppleIcon from "../../assets/apple.png";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+254",
    agreeTerms: false,
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const countryCodes = [
    { value: "+254", label: "+254 (Kenya)" },
    { value: "+1", label: "+1 (USA)" },
    { value: "+44", label: "+44 (UK)" },
    { value: "+91", label: "+91 (India)" },
    { value: "+33", label: "+33 (France)" },
    { value: "+49", label: "+49 (Germany)" },
    { value: "+81", label: "+81 (Japan)" },
    { value: "+61", label: "+61 (Australia)" },
    { value: "+86", label: "+86 (China)" },
    { value: "+27", label: "+27 (South Africa)" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryCodeSelect = (value) => {
    setFormData((prev) => ({ ...prev, countryCode: value }));
    setIsDropdownOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign up form submitted:", formData);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const featureCards = [
    {
      icon: <Users className="w-8 h-8 text-purple-500" />,
      title: "Made by humans",
      description: "100% human-created content with no AI involvement",
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-500" />,
      title: "100% original papers",
      description: "Every paper comes with anti-plagiarism check guarantee",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-purple-500" />,
      title: "PhD and MA writers",
      description: "Our expert writers deliver the best results",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex">
      {/* Left Column */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 bg-gradient-to-br from-purple-200 to-purple-300">
        <div className="mb-8 p-8 bg-white rounded-full shadow-lg">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
            <User className="w-16 h-16 text-white" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-purple-900 mb-2 text-center">
          Welcome to Pioneer Writers
        </h2>
        <p className="text-purple-700 text-center mb-12 max-w-md">
          Your trusted academic writing partner, powered by expert human writers
        </p>

        <div className="space-y-6 w-full max-w-md">
          {featureCards.map((feature, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg border border-purple-300 shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                {feature.icon}
                <div>
                  <h3 className="font-semibold text-purple-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-purple-700">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 border border-purple-200">
          <div className="text-center pb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">
              Join us!
            </h1>
            <p className="text-purple-600 mt-2">
              Create your account to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full pl-10 py-2 border border-purple-300 rounded-full focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-10 py-2 border border-purple-300 rounded-full focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Phone */}
            <div className="flex space-x-2">
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  className="w-20 px-3 py-2 border border-purple-300 rounded-full bg-white text-purple-600 flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-purple-500"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>{formData.countryCode}</span>
                  <ChevronDown className="w-4 h-4 text-purple-400" />
                </button>

                {isDropdownOpen && (
                  <ul className="absolute z-10 mt-1 w-28 bg-white border border-purple-300 rounded-lg shadow-lg max-h-40 overflow-auto transition-all duration-200 ease-in-out">
                    {countryCodes.map((code) => (
                      <li
                        key={code.value}
                        className="px-3 py-2 text-purple-600 hover:bg-purple-50 cursor-pointer"
                        onClick={() => handleCountryCodeSelect(code.value)}
                      >
                        {code.value}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="relative flex-1">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 py-2 border border-purple-300 rounded-full focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreeTerms}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    agreeTerms: e.target.checked,
                  }))
                }
                className="mt-1 rounded border-purple-300 text-purple-500"
              />
              <label htmlFor="terms" className="text-sm text-purple-600">
                I agree with the{" "}
                <Link to="/terms" className="text-purple-700 hover:underline">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="/fair-use"
                  className="text-purple-700 hover:underline"
                >
                  Fair Use Policy
                </Link>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              disabled={!formData.agreeTerms}
            >
              Register
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-purple-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-purple-600">
                Or continue with
              </span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {/* Google */}
            <button className="group border border-gray-300 p-4 rounded-full bg-white transition-colors duration-200 hover:border-purple-700">
              <img src={GoogleIcon} alt="Google" className="w-6 h-6 mx-auto" />
            </button>

            {/* Facebook */}
            <button className="group border border-gray-300 p-4 rounded-full bg-white transition-colors duration-200 hover:border-purple-700">
              <img
                src={FacebookIcon}
                alt="Facebook"
                className="w-6 h-6 mx-auto"
              />
            </button>
          </div>

          <p className="text-center text-sm text-purple-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="text-purple-700 hover:underline font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
