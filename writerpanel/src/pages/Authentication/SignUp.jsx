import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { backend } from "../../backend";
import { notify } from "../../utils/toast";
import LogoImage from "../../assets/logo.jpeg";

function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "+254",
    password: "",
    agreeTerms: false,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // field-level validation
  const validateField = (name, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{6,}$/;
    const phoneRegex = /^\+\d{1,4}\d{6,}$/;

    if (name === "fullName") {
      if (!value.trim()) return "Full name is required.";
      if (value.trim().length < 3)
        return "Full name must be at least 3 characters.";
    }
    if (name === "email") {
      if (!value) return "Email is required.";
      if (!emailRegex.test(value)) return "Invalid email format.";
    }
    if (name === "phoneNumber") {
      if (!value) return "Phone number is required.";
      if (!phoneRegex.test(value)) return "Invalid phone number.";
    }
    if (name === "password") {
      if (!value) return "Password is required.";
      if (!passwordRegex.test(value))
        return "Password must be at least 6 characters, include uppercase, lowercase, and a number or symbol.";
    }
    return "";
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "agreeTerms") {
        const error = validateField(key, formData[key]);
        if (error) errors[key] = error;
      }
    });
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" })); // clear error while typing
  };

  const handlePhoneChange = (value) => {
    const phone = value.startsWith("+") ? value : `+${value}`;
    setFormData((prev) => ({ ...prev, phoneNumber: phone }));
    setFieldErrors((prev) => ({ ...prev, phoneNumber: "" }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

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
          phoneNumber: formData.phoneNumber,
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
      {/* Background waves */}
      <svg
        className="absolute inset-0 w-full h-full z-0"
        preserveAspectRatio="none"
        viewBox="0 0 1000 1000"
      >
        <path
          d="M0 180 Q 300 80, 520 200 T 1000 220"
          className="stroke-slate-300 stroke-2 fill-none opacity-70 animate-slowWave"
        />
        <path
          d="M0 620 Q 200 500, 480 640 T 1000 580"
          className="stroke-slate-400 stroke-[1.75] fill-none opacity-50 animate-slowWaveReverse delay-700"
        />
      </svg>

      <div className="w-full max-w-md bg-white bg-opacity-95 rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-200 z-10">
        {/* Logo + Header */}
        <div className="text-center mb-6">
          <img
            src={LogoImage}
            alt="Logo"
            className="w-40 sm:w-48 h-auto object-contain mx-auto mb-4"
          />
          <h1 className="text-xl font-extrabold text-writerTeal">
            Join us now!
          </h1>
          <p className="text-gray-600 mt-2 text-xs">Sign up now</p>
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
              onBlur={handleBlur}
              required
              className={`w-full pl-12 py-3 rounded-full border bg-white focus:outline-none focus:ring-2 placeholder:text-sm ${
                fieldErrors.fullName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-gray-100"
              }`}
            />
            {fieldErrors.fullName && (
              <p className="text-red-500 text-xs mt-1 ml-2">
                {fieldErrors.fullName}
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
              onBlur={handleBlur}
              required
              className={`w-full pl-12 py-3 rounded-full border bg-white focus:outline-none focus:ring-2 placeholder:text-sm ${
                fieldErrors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-gray-100"
              }`}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1 ml-2">
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="relative">
            <PhoneInput
              country={"ke"}
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              inputProps={{
                name: "phoneNumber",
                required: true,
                onBlur: () => {
                  const error = validateField(
                    "phoneNumber",
                    formData.phoneNumber
                  );
                  setFieldErrors((prev) => ({ ...prev, phoneNumber: error }));
                },
                className: `w-full pl-12 py-3 rounded-full border bg-white focus:outline-none focus:ring-2 placeholder:text-sm ${
                  fieldErrors.phoneNumber
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-gray-100"
                }`,
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
            {fieldErrors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1 ml-2">
                {fieldErrors.phoneNumber}
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
              onBlur={handleBlur}
              required
              className={`w-full pl-12 pr-10 py-3 rounded-full border bg-white focus:outline-none focus:ring-2 placeholder:text-sm text-lg tracking-widest font-medium ${
                fieldErrors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-gray-100"
              }`}
              style={{
                WebkitTextSecurity: showPassword ? "none" : "disc",
                MozTextSecurity: showPassword ? "none" : "disc",
              }}
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
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1 ml-2">
                {fieldErrors.password}
              </p>
            )}

            {/* Password strength feedback */}
            {formData.password && !fieldErrors.password && (
              <p
                className={`text-xs mt-1 ml-2 ${
                  formData.password.length < 8
                    ? "text-red-500"
                    : /[A-Z]/.test(formData.password) &&
                      /[0-9\W]/.test(formData.password)
                    ? "text-green-600"
                    : "text-yellow-500"
                }`}
              >
                {formData.password.length < 8
                  ? "Too short (min 8 characters)"
                  : /[A-Z]/.test(formData.password) &&
                    /[0-9\W]/.test(formData.password)
                  ? "Strong password"
                  : "Add uppercase, number or symbol for strength"}
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
                to="/privacy-policy"
                className="text-writerTeal font-semibold"
              >
                Privacy Policy
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

        {/* Footer */}
        <div className="mt-6 text-center">
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
