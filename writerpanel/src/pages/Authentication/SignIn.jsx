import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, X } from "lucide-react";
import { notify } from "../../utils/toast";
import { backend } from "../../backend";
import LogoImage from "../../assets/logo.jpeg";

function SignIn() {
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showForgotModal, setShowForgotModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/public-orders";

  const validateField = (name, value) => {
    if (name === "email") {
      if (!value) return "Email is required";
      if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
    }
    if (name === "password") {
      if (!value) return "Password is required";
    }
    return "";
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Invalid email format";
    if (!formData.password) errors.password = "Password is required";
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Only clear error for the field being typed, don't validate yet
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    // Validate field on blur
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
    setIsLoading(true);

    try {
      const response = await fetch(`${backend}/auth/writer/sign-in`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("userRole", data.writer.role);
      localStorage.setItem("userEmail", data.writer.email);
      localStorage.setItem("isLoggedIn", "true");

      notify.success("Login successful.");
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1500);
    } catch (error) {
      const msg = error.message?.toLowerCase?.();
      if (msg?.includes("already logged in")) {
        notify.info("Already logged in");
        navigate("/public-orders");
      } else {
        notify.error(error.message || "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset Password API call
  const resetPassword = async () => {
    if (!email) {
      notify.error("Please enter an email");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      notify.error("Invalid email format");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${backend}/password/send/password-reset-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      notify.success(data.message);
      setShowForgotModal(false);
      setEmail("");
    } catch (error) {
      notify.info(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 relative overflow-hidden">
      {/* Background Waves */}
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

      {/* Sign-In Container */}
      <div className="w-full max-w-md bg-white bg-opacity-95 rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-200 z-10">
        <div className="text-center mb-6">
          <img
            src={LogoImage}
            alt="Logo"
            className="w-40 sm:w-48 h-auto object-contain mx-auto mb-4"
          />
          <h1 className="text-2xl font-extrabold text-writerTeal">
            Welcome back
          </h1>
          <p className="text-gray-600 mt-2 text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
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

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`w-full pl-12 pr-10 py-3 rounded-full border bg-white focus:outline-none focus:ring-2 placeholder:text-sm ${
                fieldErrors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-gray-100"
              }`}
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
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-writerTeal hover:underline"
              onClick={() => setShowForgotModal(true)}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
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
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">Don't have an account?</p>
          <Link
            to="/sign-up"
            className="inline-block mt-2 px-6 py-2 text-writerTeal border border-writerTeal rounded-full hover:bg-slate-300 transition-all duration-200 font-medium"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
          <div className="relative bg-white w-full max-w-md mx-auto rounded-2xl p-6 shadow-lg border border-slate-300">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold text-slate-700 mb-4">
              Reset your password
            </h2>
            <div className="mb-4">
              <label
                htmlFor="forgotEmail"
                className="block text-sm text-slate-600 mb-1"
              >
                Please enter your associated email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-full border border-slate-300 focus:ring-1 focus:ring-gray-200 focus:outline-none placeholder:text-sm"
                required
              />
            </div>
            <button
              type="button"
              onClick={resetPassword}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white py-2.5 rounded-full shadow hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 mx-auto text-white"
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
                "Send"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignIn;
