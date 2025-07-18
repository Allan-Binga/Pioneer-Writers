import { useState, useEffect, useRef } from "react";
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
import SignupImage from "../../assets/background.jpg";
import LogoImage from "../../assets/logo.jpeg";

function SignUp() {
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
    <div className="min-h-screen flex bg-gradient-to-br from-white to-zinc-100">
      {/* Left Column */}
      <div className="hidden lg:flex w-1/2 h-screen flex-col items-center justify-center relative overflow-hidden">
        {/* Auth Background Image */}
      </div>
    </div>
  );
}

export default SignUp;
