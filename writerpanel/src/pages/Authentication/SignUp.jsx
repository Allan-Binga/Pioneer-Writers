import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import styles
import { backend } from "../../backend";
import { notify } from "../../utils/toast";
import LogoImage from "../../assets/logo.jpeg";

function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "+254", // Initialize with country code
    password: "",
    agreeTerms: false,
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      phoneNumber: value.startsWith("+") ? value : `+${value}`,
    }));
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{6,}$/;
    const phoneRegex = /^\+\d{1,4}\d{6,}$/;

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required.";
    } else if (formData.fullName.trim().length < 3) {
      errors.fullName = "Full name must be at least 3 characters.";
    }

    if (!emailRegex.test(formData.email))
      errors.email = "Please enter a valid email address.";
    if (!passwordRegex.test(formData.password))
      errors.password =
        "Password must be at least 6 characters, include uppercase, lowercase, and a number or symbol.";
    if (!phoneRegex.test(formData.phoneNumber))
      errors.phoneNumber = "Please enter a valid phone number.";
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
    if (!formData.agreeTerms) {
      notify.error("Please agree to the Terms & Conditions.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${backend}/auth/writer/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber, // Full phone number with country code
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 relative overflow-hidden">
      {/* SVG Background with Smooth Lines */}
      <svg
        className="absolute inset-0 w-full h-full z-0"
        preserveAspectRatio="none"
        viewBox="0 0 1000 1000"
      >
        {/* Top gentle wave */}
        <path
          d="M0 180 Q 300 80, 520 200 T 1000 220"
          className="stroke-slate-300 stroke-2 fill-none opacity-70 animate-slowWave"
        />

        {/* Bottom more dramatic wave */}
        <path
          d="M0 620 Q 200 500, 480 640 T 1000 580"
          className="stroke-slate-400 stroke-[1.75] fill-none opacity-50 animate-slowWaveReverse delay-700"
        />
      </svg>

      {/* Form Container */}
      <div className="w-full max-w-md bg-white bg-opacity-95 rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-200 z-10">
        {/* Logo */}

        <div className="text-center mb-6">
          <img
            src={LogoImage}
            alt="Logo"
            className="w-40 sm:w-48 h-auto object-contain mx-auto mb-4"
          />
          <h1 className="text-2xl font-extrabold text-writerTeal">
            Join us now!
          </h1>
          <p className="text-gray-600 mt-2 text-sm">Sign up now</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="relative">
            <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className="w-full pl-12 py-3 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-100 placeholder:text-sm"
            />
            {validationErrors.fullName && (
              <p className="text-red-500 text-xs mt-1 ml-2">
                {validationErrors.fullName}
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
              className="w-full pl-12 py-3 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-100 placeholder:text-sm"
            />
            {validationErrors.email && (
              <p className="text-red-500 text-xs mt-1 ml-2">
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Phone Number with react-phone-input-2 */}
          <div className="relative">
            <PhoneInput
              country={"ke"} // Default to Kenya
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              inputProps={{
                name: "phoneNumber",
                required: true,
                className:
                  "w-full pl-12 py-3 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-100 placeholder:text-sm",
              }}
              buttonStyle={{
                border: "1px solid #d1d5db",
                borderRadius: "9999px 0 0 9999px",
                background: "white",
              }}
              dropdownStyle={{
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
              }}
            />
            {validationErrors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1 ml-2">
                {validationErrors.phoneNumber}
              </p>
            )}
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
              className="w-full pl-12 pr-10 py-3 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-100 placeholder:text-sm"
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
              <p className="text-red-500 text-xs mt-1 ml-2">
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
              className="mt-1 rounded border-gray-300 text-writerTeal focus:ring-writerTeal"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the{" "}
              <Link
                to="/terms-and-conditions"
                className="text-writerTeal font-semibold"
              >
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link
                to="/fair-use-policy"
                className="text-writerTeal font-semibold"
              >
                Fair Use Policy
              </Link>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!formData.agreeTerms || isLoading}
            className="w-full bg-writerTeal hover:bg-writerTeal-700 text-white py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center cursor-pointer"
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
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500 bg-white px-2">
              Or sign up with
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">Already have an account?</p>
          <Link
            to="/sign-in"
            className="inline-block mt-2 px-6 py-2 text-writerTeal border border-writerTeal rounded-full hover:bg-slate-300 transition-all duration-200 font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
