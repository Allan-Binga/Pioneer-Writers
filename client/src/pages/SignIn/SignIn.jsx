import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, BookCopy, Eye, EyeOff } from "lucide-react";
import GoogleIcon from "../../assets/google.png";
import FacebookIcon from "../../assets/facebook.png";
import { notify } from "../../utils/toast";
import { endpoint } from "../../server";

function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

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
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${endpoint}/auth/sign-in`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed, please try again.");
      }

      // Store user data
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("isLoggedIn", "true");

      notify.success("Login successful.");
      setTimeout(() => {
        if (data.user.role === "Admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 1500);
    } catch (error) {
      const errorMessage = error.message?.toLowerCase?.();
      if (errorMessage?.includes("already logged in")) {
        notify.info("You are already logged in.");
        navigate("/dashboard");
      } else {
        notify.error(errorMessage || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex">
      {/* Left Column */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 bg-gradient-to-br from-purple-200 to-purple-300">
        <div className="mb-8 p-8 bg-white rounded-full shadow-lg">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
            <BookCopy className="w-16 h-16 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-purple-900 mb-2 text-center">
          Pioneer Writers
        </h2>
        <p className="text-purple-700 text-center mb-12 max-w-md">
          Your trusted writing partner with expert assistance
        </p>
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 border border-purple-200">
          <div className="text-center pb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">
              Welcome back!
            </h1>
            <p className="text-purple-600 mt-2">
              New to Pioneer Writers?{" "}
              <Link to="/sign-up" className="text-purple-700 hover:underline">
                Sign Up Now
              </Link>
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-4 h-4 w-4 text-purple-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full pl-10 py-3 border border-purple-300 rounded-full focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-4 h-4 w-4 text-purple-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-10 py-3 border border-purple-300 rounded-full focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600 transition"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {fieldErrors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-purple-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 cursor-pointer flex items-center justify-center"
            >
              {loading ? (
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
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-purple-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-purple-600">
                Or sign in with
              </span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button className="group border border-gray-300 p-4 rounded-full bg-white transition-colors duration-200 hover:border-purple-700 cursor-pointer">
              <img src={GoogleIcon} alt="Google" className="w-6 h-6 mx-auto" />
            </button>
            <button className="group border border-gray-300 p-4 rounded-full bg-white transition-colors duration-200 hover:border-purple-700 cursor-pointer">
              <img
                src={FacebookIcon}
                alt="Facebook"
                className="w-6 h-6 mx-auto"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
