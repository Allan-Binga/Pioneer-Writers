import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, X } from "lucide-react";
import GoogleIcon from "../../assets/google.png";
import FacebookIcon from "../../assets/facebook.png";
import { notify } from "../../utils/toast";
import { endpoint } from "../../server";
import { useGoogleLogin } from "@react-oauth/google";
import AuthImage from "../../assets/signupImage.webp";
import LogoImage from "../../assets/logo.jpeg";

function SignIn() {
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showForgotModal, setShowForgotModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!formData.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Invalid email format";
    if (!formData.password) errors.password = "Password is required";
    return errors;
  };

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
        navigate(data.user.role === "Admin" ? "/home" : "/home");
      }, 1500);
    } catch (error) {
      const msg = error.message?.toLowerCase?.();
      if (msg?.includes("already logged in")) {
        notify.info("Already logged in");
        navigate("/home");
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
        navigate(data.user.role === "User" ? "/home" : "/home");
      }, 1000);
    } catch (err) {
      const msg = err.message?.toLowerCase?.();
      if (msg?.includes("already logged in")) {
        notify.info("Already logged in");
        navigate("/home");
      } else {
        notify.error(err.message || "Google login failed");
      }
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
      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      const msg = err.message?.toLowerCase?.();
      if (msg?.includes("already logged in")) {
        notify.info("Already logged in");
        navigate("/home");
      } else {
        notify.error(err.message || "Facebook login failed");
      }
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => notify.error("Google sign-in failed"),
    flow: "implicit",
  });

  //Reset Password API call
  const resetPassword = async () => {
    if (!email) {
      notify.error("Please enter an email");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      notify.error("Invalid email format");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${endpoint}/password/send/password-reset-email`,
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
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-white to-white">
      {/* Left Column */}
      <div className="hidden lg:flex w-full lg:w-1/2 h-[300px] lg:h-screen items-center justify-center relative overflow-hidden">
        <div className="w-full h-full relative z-0">
          <img
            src={AuthImage}
            alt="Auth Background"
            className="w-full h-full object-cover object-center shadow-lg"
          />
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 md:px-8 py-4 sm:py-6 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 sm:p-8 border border-slate-200">
          {/* Rest of the form content remains unchanged */}
          {/* Logo + Welcome */}
          <div className="text-center mb-6">
            <img
              src={LogoImage}
              alt="Logo"
              className="mx-auto w-[180px] h-auto object-contain mb-4"
            />
            <h1 className="text-lg font-bold bg-gradient-to-r from-gray-500 to-gray-600 bg-clip-text text-transparent">
              Welcome back!
            </h1>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full pl-10 py-2.5 border border-slate-300 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-200 placeholder:text-xs"
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-2.5 border border-stone-300 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-200 placeholder:text-xs"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {fieldErrors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-amber-600 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center cursor-pointer"
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

          {/* Divider */}
          <div className="my-8">
            <div className="flex items-center justify-center">
              <div className="flex-grow border-t border-slate-300"></div>
              <span className="mx-4 text-xs text-slate-600 bg-white px-3">
                Or sign in with
              </span>
              <div className="flex-grow border-t border-slate-300"></div>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={googleLogin}
              className="border border-gray-300 p-3 rounded-full bg-white hover:border-gray-400 transition duration-200 flex items-center justify-center"
            >
              <img src={GoogleIcon} alt="Google" className="w-6 h-6" />
            </button>
            <button
              onClick={handleFacebookLogin}
              className="border border-gray-300 p-3 rounded-full bg-white hover:border-gray-400 transition duration-200 flex items-center justify-center"
            >
              <img src={FacebookIcon} alt="Facebook" className="w-6 h-6" />
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-600">Don’t have an account?</p>
            <Link
              to="/sign-up"
              className="inline-block mt-2 px-6 text-xs py-2 text-amber-600 border border-amber-400 rounded-full hover:bg-amber-50 transition-all duration-200 font-medium"
            >
              Sign Up Now
            </Link>
          </div>
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
              {loading ? (
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
