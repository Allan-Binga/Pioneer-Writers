import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, X } from "lucide-react";
import GoogleIcon from "../../assets/google.png";
import FacebookIcon from "../../assets/facebook.png";
import { notify } from "../../utils/toast";
import { endpoint } from "../../server";
import { useGoogleLogin } from "@react-oauth/google";
import SignupImage from "../../assets/background.webp";
import LogoImage from "../../assets/logo.jpeg";

function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
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
      // console.log("Facebook SDK initialized");
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
      const response = await fetch(`${endpoint}/auth/administrator/sign-in`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("userRole", data.admin.role);
      localStorage.setItem("adminEmail", data.admin.email);

      localStorage.setItem("isLoggedIn", "true");

      notify.success("Login successful.");
      setTimeout(() => {
        navigate(
          data.admin.role === "Administrator" ? "/dashboard" : "/dashboard"
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
      if (!token) throw new Error("No token returned from Google");

      const response = await fetch(
        `${endpoint}/oauth2/administrator/sign-in/google`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        }
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Google sign-in failed");

      localStorage.setItem("userRole", data.admin.role);
      localStorage.setItem("userEmail", data.admin.email);
      localStorage.setItem("isLoggedIn", "true");

      notify.success("Logged in with Google");
      setTimeout(() => {
        navigate(
          data.admin.role === "Administrator" ? "/dashboard" : "/dashboard"
        );
      }, 1000);
    } catch (err) {
      const msg = err.message?.toLowerCase?.();
      if (msg?.includes("already logged in")) {
        notify.info("Already logged in");
        navigate("/dashboard");
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
      const res = await fetch(
        `${endpoint}/oauth2/administrator/sign-in/facebook`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: accessToken }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Facebook login failed");

      localStorage.setItem("userRole", data.admin.role);
      localStorage.setItem("adminEmail", data.admin.email);
      localStorage.setItem("isLoggedIn", "true");

      notify.success("Facebook login successful");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      const msg = err.message?.toLowerCase?.();
      if (msg?.includes("already logged in")) {
        notify.info("Already logged in");
        navigate("/dashboard");
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

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-white to-white">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="text-center pb-4">
            <div className="mb-4">
              <img
                src={LogoImage}
                alt="Logo"
                className="mx-auto w-[180px] h-auto object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-500 to-gray-600 bg-clip-text text-transparent">
              Administrator Access
            </h1>
          </div>

          <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
            <div className="relative">
              <Mail className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full pl-10 py-2.5 border border-slate-300 rounded-full focus:outline-none focus:ring-1 focus:ring-amber-100"
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
                className="w-full pl-10 py-2.5 border border-stone-300 rounded-full focus:outline-none focus:ring-1 focus:ring-amber-100"
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
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-sm text-slate-700 hover:underline"
              >
                Forgot password?
              </button>
            </div>

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
          <div className="my-8 relative">
            <div className="flex items-center justify-center">
              <div className="flex-grow border-t border-slate-300"></div>
              <span className="mx-4 text-sm text-slate-600 bg-white px-3">
                Or sign in with
              </span>
              <div className="flex-grow border-t border-slate-300"></div>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => googleLogin()}
              className="group border border-gray-300 p-4 rounded-full bg-white hover:border-gray-400 transition duration-200 flex items-center justify-center cursor-pointer"
            >
              <img src={GoogleIcon} alt="Google" className="w-6 h-6" />
            </button>

            <button
              onClick={handleFacebookLogin}
              className="group border border-gray-300 p-4 rounded-full bg-white hover:border-gray-400 transition duration-200 flex items-center justify-center cursor-pointer"
            >
              <img src={FacebookIcon} alt="Facebook" className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-stone-700">Don’t have an account?</p>
            <Link
              to="/sign-up"
              className="inline-flex items-center justify-center mt-2 px-4 py-2 text-sm font-semibold text-amber-600 hover:text-white border border-amber-600 hover:bg-amber-600 rounded-full transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Account
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 h-screen flex-col items-center justify-center relative overflow-hidden">
        <div className="w-full h-full relative z-0">
          <img
            src={SignupImage}
            alt="Auth Background"
            className="w-full h-full object-cover object-center shadow-lg"
          />
        </div>
      </div>

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
                className="block text-sm text-slate-600 mb-1"
                htmlFor="forgotEmail"
              >
                Please enter your email
              </label>
              <input
                id="forgotEmail"
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-full border border-slate-300 focus:ring-1 focus:ring-slate-600 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                if (!forgotEmail) return notify.error("Please enter an email");
                notify.success("Password reset link sent!");
                setShowForgotModal(false);
              }}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white py-2.5 rounded-full shadow hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignIn;
