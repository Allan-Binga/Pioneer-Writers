import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
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
import AuthImage from "../../assets/signupImage.webp";
import LogoImage from "../../assets/logo.jpeg";

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

  useEffect(() => {
    // Add fb-root if it doesn't exist (required by Facebook SDK)
    if (!document.getElementById("fb-root")) {
      const fbDiv = document.createElement("div");
      fbDiv.id = "fb-root";
      document.body.appendChild(fbDiv);
    }

    // Prevent duplicate SDK injection
    if (document.getElementById("facebook-jssdk")) return;

    // Set fbAsyncInit FIRST — before loading script
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: false,
        version: "v16.0",
      });
      console.log("Facebook SDK initialized");
    };

    // Inject Facebook SDK
    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.async = true;
    script.defer = true;
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.onerror = () => console.error("Failed to load Facebook SDK");
    document.body.appendChild(script);

    // Optional: handle click outside logic
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      const existingScript = document.getElementById("facebook-jssdk");
      if (existingScript) existingScript.remove();
      delete window.fbAsyncInit;
      delete window.FB;
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryCodeSelect = (value) => {
    setFormData((prev) => ({ ...prev, countryCode: value }));
    setIsDropdownOpen(false);
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{6,}$/;

    if (!emailRegex.test(formData.email))
      errors.email = "Please enter a valid email address.";
    if (!passwordRegex.test(formData.password))
      errors.password =
        "Password must be at least 6 characters, include uppercase, lowercase, and a number or symbol.";
    if (formData.userName.trim() === "")
      errors.userName = "Username is required.";
    if (formData.phoneNumber.trim() === "")
      errors.phoneNumber = "Phone number is required.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});
    if (!formData.agreeTerms) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${endpoint}/auth/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: formData.userName,
          email: formData.email,
          phoneNumber: formData.countryCode + formData.phoneNumber,
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");
      notify.success(data.message || "Successfully registered!");
      setTimeout(() => navigate("/sign-in"), 4000);
    } catch (error) {
      notify.error(error.message || "Failed to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
      setTimeout(
        () => navigate(data.user.role === "User" ? "/dashboard" : "/dashboard"),
        1000
      );
    } catch (err) {
      notify.error(err.message || "Google login failed");
    }
  };

  const handleFacebookLogin = () => {
    if (!window.FB) {
      console.error("Facebook SDK not loaded");
      notify.error("Facebook SDK is not ready. Please try again.");
      return;
    }

    window.FB.login(
      (response) => {
        console.log("FB.login response:", response);
        if (response.authResponse) {
          const { accessToken } = response.authResponse;
          handleFacebookAuthResponse(accessToken);
        } else {
          notify.error("Facebook login was cancelled or failed.");
        }
      },
      { scope: "public_profile,email" }
    );
  };

  const handleFacebookAuthResponse = async (accessToken) => {
    try {
      const res = await fetch(`${endpoint}/oauth2/sign-in/facebook`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: accessToken }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Facebook login failed");

      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("isLoggedIn", "true");

      notify.success("Facebook login successful");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      notify.error(err.message || "Facebook login failed");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => notify.error("Google sign-up failed"),
    flow: "implicit",
  });

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-white to-gray-100">
      {/* Left Column */}
      <div className="hidden lg:flex w-1/2 h-screen flex-col items-center justify-center relative overflow-hidden">
        {/* Auth Background Image */}
        <div className="w-full h-full relative z-0">
          <img
            src={AuthImage}
            alt="Auth Background"
            className="w-full h-full object-cover object-center shadow-lg"
          />
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-8 border border-slate-200">
          {/* Logo Image */}
          <div className="text-center mb-6">
            <img
              src={LogoImage}
              alt="Logo"
              className="w-[200px] h-auto object-contain mx-auto mb-4"
            />
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
              Join us!
            </h1>
            <p className="text-stone-600 mt-2 text-sm">
              Sign up now
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="relative">
              <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                id="userName"
                name="userName"
                type="text"
                placeholder="Username"
                value={formData.userName}
                onChange={handleInputChange}
                required
                className="w-full pl-12 py-3 rounded-full border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
              />
              {validationErrors.userName && (
                <p className="text-amber-600 text-xs mt-1 ml-2">
                  {validationErrors.userName}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-12 py-3 rounded-full border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
              />
              {validationErrors.email && (
                <p className="text-amber-600 text-xs mt-1 ml-2">
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="flex space-x-2">
              <div className="relative w-24" ref={dropdownRef}>
                <button
                  type="button"
                  className="w-full py-3 px-4 border border-stone-300 rounded-full bg-white text-gray-600 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-amber-100"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>{formData.countryCode}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {isDropdownOpen && (
                  <ul className="absolute z-10 mt-1 w-full bg-white border border-stone-300 rounded-lg shadow-md max-h-48 overflow-auto">
                    {countryCodes.map((code) => (
                      <li
                        key={code.value}
                        className="px-3 py-2 text-gray-600 hover:bg-amber-100 cursor-pointer"
                        onClick={() => handleCountryCodeSelect(code.value)}
                      >
                        {code.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="relative flex-1">
                <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="(000) 000 - 0000"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 py-3 rounded-full border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                />
              </div>
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full pl-12 pr-10 py-3 rounded-full border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
              />
              <button
                type="button"
                className="absolute right-4 top-3.5 text-gray-400"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {validationErrors.password && (
                <p className="text-amber-600 text-xs mt-1 ml-2">
                  {validationErrors.password}
                </p>
              )}
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
                className="mt-1 rounded border-stone-300 text-gray-500"
              />
              <label htmlFor="terms" className="text-sm text-stone-700">
                I agree to the{" "}
                <Link
                  to="/terms-and-conditions"
                  className="text-gray-600 underline font-semibold"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="/sign-up"
                  className="text-gray-600 underline font-semibold"
                >
                  Fair Use Policy
                </Link>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!formData.agreeTerms || isLoading}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center cursor-pointer"
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="flex items-center justify-center">
              <div className="flex-grow border-t border-slate-300"></div>
              <span className="mx-4 text-sm text-slate-500 bg-white px-2">
                Or sign up with
              </span>
              <div className="flex-grow border-t border-slate-300"></div>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={googleLogin}
              className="border border-slate-300 p-3 rounded-full bg-white hover:border-slate-400 flex items-center justify-center transition-colors duration-200 cursor-pointer"
            >
              <img src={GoogleIcon} alt="Google" className="w-6 h-6" />
            </button>
            <button
              onClick={handleFacebookLogin}
              className="border border-slate-300 p-3 rounded-full bg-white hover:border-slate-400 flex items-center justify-center transition-colors duration-200 cursor-pointer"
            >
              <img src={FacebookIcon} alt="Facebook" className="w-6 h-6" />
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-stone-700 mt-6">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="text-slate-700 hover:font-semibold hover:underline"
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
