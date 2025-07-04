import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, BookCopy, Eye, EyeOff } from "lucide-react";
import GoogleIcon from "../../assets/google.png";
import FacebookIcon from "../../assets/facebook.png";
import Logo from "../../assets/logo.jpg";
import { notify } from "../../utils/toast";
import { endpoint } from "../../server";
import { useGoogleLogin } from "@react-oauth/google";

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("isLoggedIn", "true");

      notify.success("Login successful.");
      setTimeout(() => {
        navigate(
          data.user.role === "Admin" ? "/admin/dashboard" : "/dashboard"
        );
      }, 1500);
    } catch (error) {
      const msg = error.message?.toLowerCase?.();
      if (msg?.includes("already logged in")) {
        notify.info("Already logged in");
        navigate("/dashboard");
      } else {
        notify.error(error.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const token = tokenResponse.access_token;
      // console.log(token)

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

      notify.success("Logged in with Google");
      setTimeout(() => {
        navigate(data.user.role === "User" ? "/dashboard" : "/dashboard");
      }, 1000);
    } catch (err) {
      notify.error(err.message || "Google login failed");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => notify.error("Google sign-in failed"),
    flow: "implicit",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* Left Column */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 bg-gradient-to-br from-slate-200 to-slate-300">
        <div className="mb-8 p-8 bg-white rounded-full shadow-lg">
          <div className="w-64 h-64">
            <img
              src={Logo}
              alt="Pioneer Writers Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">
          Pioneer Writers
        </h2>
        <p className="text-slate-700 text-center mb-12 max-w-md">
          Your trusted writing partner with expert assistance
        </p>
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 border border-slate-200">
          <div className="text-center pb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-500 to-slate-700 bg-clip-text text-transparent">
              Welcome back!
            </h1>
            <p className="text-slate-600 mt-2">
              New to Pioneer Writers?{" "}
              <Link to="/sign-up" className="text-slate-700 hover:underline">
                Sign Up Now
              </Link>
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <Mail className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full pl-10 py-3 border border-slate-300 rounded-full focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-10 py-3 border border-slate-300 rounded-full focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
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
                className="text-sm text-slate-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-slate-500 to-slate-700 hover:from-slate-600 hover:to-slate-800 text-white py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
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

          <div className="my-6 relative">
            <div className="flex items-center justify-center">
              <div className="flex-grow border-t border-slate-300"></div>
              <span className="mx-4 text-sm text-slate-600 bg-white px-2">
                Or sign in with your social accounts
              </span>
              <div className="flex-grow border-t border-slate-300"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => googleLogin()}
              className="group border border-gray-300 p-4 rounded-full bg-white transition-colors duration-200 hover:border-slate-700 cursor-pointer flex items-center justify-center"
            >
              <img src={GoogleIcon} alt="Google" className="w-6 h-6" />
            </button>

            <button className="group border border-gray-300 p-4 rounded-full bg-white transition-colors duration-200 hover:border-slate-700 cursor-pointer">
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
