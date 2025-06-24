import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Users,
  Shield,
  ChevronDown,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "../../assets/google.png";
import FacebookIcon from "../../assets/facebook.png";
import { endpoint } from "../../server";
import { notify } from "../../utils/toast";
import { useGoogleLogin } from "@react-oauth/google";

const SignUp = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
    countryCode: "+254",
    agreeTerms: false,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
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

  //Form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //Phone country code selection
  const handleCountryCodeSelect = (value) => {
    setFormData((prev) => ({ ...prev, countryCode: value }));
    setIsDropdownOpen(false);
  };

  //Form validation to ensure correct email and password inputs are inserted
  const validateForm = () => {
    const errors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{6,}$/;

    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!passwordRegex.test(formData.password)) {
      errors.password =
        "Password must be at least 6 characters, include uppercase, lowercase, and a number or symbol.";
    }

    if (formData.userName.trim() === "") {
      errors.userName = "Username is required.";
    }

    if (formData.phoneNumber.trim() === "") {
      errors.phoneNumber = "Phone number is required.";
    }

    return errors;
  };

  //Sign-up Handle SUbmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({}); // clear previous errors

    if (!formData.agreeTerms) return;
    setIsLoading(true);

    e.preventDefault();
    if (!formData.agreeTerms) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${endpoint}/auth/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: formData.userName,
          email: formData.email,
          phoneNumber: formData.countryCode + formData.phoneNumber,
          password: formData.password,
        }),
      });
      // console.log(endpoint)

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      notify.success(data.message || "Successfully registered!");
      setTimeout(() => navigate("/sign-in"), 4000);
    } catch (error) {
      notify.error(error.message || "Failed to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  //Google OAuth2
  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const token = tokenResponse.access_token;

      if (!token) throw new Error("No token returned from Google");

      const response = await fetch(`${endpoint}/oauth2/sign-in/google`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Google sign-in failed");

      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("isLoggedIn", "true");

      notify.success("Sign-up successful");
      setTimeout(() => {
        navigate(data.user.role === "User" ? "/dashboard" : "/dashboard");
      }, 1000);
    } catch (err) {
      notify.error(err.message || "Google login failed");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => notify.error("Google sign-up failed"),
    flow: "implicit",
  });

  //Outside country code card clicks useEffect
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //Right Section IMplementation
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
            {/* Username */}
            <div className="relative">
              <User className="absolute left-4 top-4 h-4 w-4 text-purple-600" />
              <input
                id="userName"
                name="userName"
                type="text"
                placeholder="Username"
                value={formData.userName}
                onChange={handleInputChange}
                required
                className="w-full pl-10 py-3 border border-purple-300 rounded-full focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              {validationErrors.userName && (
                <p className="text-red-500 text-sm mt-1 ml-2">
                  {validationErrors.userName}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-4 h-4 w-4 text-purple-400" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-10 py-3 border border-purple-300 rounded-full focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1 ml-2">
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="flex space-x-2">
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  className="w-20 px-3 py-3 border border-purple-300 rounded-full bg-white text-purple-600 flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-purple-500"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>{formData.countryCode}</span>
                  <ChevronDown className="w-4 h-4 text-purple-400" />
                </button>
                {validationErrors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1 ml-2">
                    {validationErrors.phoneNumber}
                  </p>
                )}

                {isDropdownOpen && (
                  <ul className="absolute z-10 mt-1 w-28 bg-white border border-purple-300 rounded-lg shadow-lg max-h-40 overflow-auto transition-all duration-200 ease-in-out">
                    {countryCodes.map((code) => (
                      <li
                        key={code.value}
                        className="px-3 py-2 text-purple-600 hover:bg-purple-50 cursor-pointer"
                        onClick={() => handleCountryCodeSelect(code.value)}
                      >
                        {code.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="relative flex-1">
                <Phone className="absolute left-4 top-4 h-4 w-4 text-purple-400" />
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="(000) 000 - 0000"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 py-3 border border-purple-300 rounded-full focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-4 h-4 w-4 text-purple-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-10 py-3 border border-purple-300 rounded-full focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              {validationErrors.password && (
                <p className="text-red-500 text-sm mt-1 ml-2">
                  {validationErrors.password}
                </p>
              )}

              <button
                type="button"
                className="absolute right-4 top-4 text-purple-400 hover:text-purple-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
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
                <Link
                  to="/terms"
                  className="text-purple-700 hover:underline font-semibold"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="/fair-use"
                  className="text-purple-700 hover:underline font-semibold"
                >
                  Fair Use Policy
                </Link>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 cursor-pointer flex items-center justify-center"
              disabled={!formData.agreeTerms || isLoading}
            >
              {isLoading ? (
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="flex items-center justify-center">
              <div className="flex-grow border-t border-purple-300"></div>
              <span className="mx-4 text-sm text-purple-600 bg-white px-2">
                Or sign up with your social accounts
              </span>
              <div className="flex-grow border-t border-purple-300"></div>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => googleLogin()}
              className="group border border-gray-300 p-4 rounded-full bg-white transition-colors duration-200 hover:border-purple-700 cursor-pointer flex items-center justify-center"
            >
              <img src={GoogleIcon} alt="Google" className="w-6 h-6" />
            </button>
            <button className="group border border-gray-300 p-4 rounded-full bg-white transition-colors duration-200 hover:border-purple-700 cursor-pointer">
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
              className="text-purple-700 hover:text-purple-950 font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
