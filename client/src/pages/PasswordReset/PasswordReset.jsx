import AuthImage from "../../assets/signupImage.webp";
import { endpoint } from "../../server";
import axios from "axios";
import { notify } from "../../utils/toast";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";

function PasswordReset() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showResend, setShowResend] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  //Run Token Verification
  useEffect(() => {
    if (token) {
      const verifyToken = async () => {
        try {
          const response = await axios.get(
            `${endpoint}/password/verify/password/reset-token?token=${token}`
          );
          setMessage(response.data.message);
          setStatus("success");
        } catch (error) {
          setMessage(
            error.response?.data?.message || "Token verification failed."
          );
          setStatus("error");
          setShowResend(true);
        }
      };
      verifyToken();
    }
  }, [token]);

  //Resend Password Reset Email
  const resendPasswordResetEmail = async () => {
    if (!email) {
      setMessage("Please enter your email.");
      setStatus("error");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${endpoint}/password/send/password-reset-email`,
        { email }
      );
      setMessage(response.data.message);
      setStatus("success");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to resend email.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  //Password Reset Submission
  const resetPasswordToken = async () => {
    try {
      const response = await axios.put(
        `${endpoint}/password/reset/password/token`,
        { token, newPassword, confirmPassword }
      );
      setMessage(response.data.message);
      setStatus("success");
      setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to reset password.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  //Form Submission Handleer
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    // Client-side validation
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setStatus("error");
      return;
    }

    resetPasswordToken();
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center px-6 sm:px-8 lg:px-10"
      style={{ backgroundImage: `url(${AuthImage})` }}
    >
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md mt-4 bg-white p-6 rounded-lg shadow-md border-amber-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Reset Password
          </h2>

          {/* Status Message */}
          {message && (
            <div
              className={`mb-4 p-3 rounded-full flex items-center gap-2 ${
                status === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {status === "success" ? <CheckCircle /> : <AlertCircle />}
              {message}
            </div>
          )}

          {/* Conditional Rendering */}
          {showResend ? (
            // Resend Email Component
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Enter your email to request a new password reset link
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-full focus:ring-1 focus:ring-gray-100 focus:outline-none placeholder:text-sm"
                  required
                />
              </div>
              <button
                onClick={resendPasswordResetEmail}
                className="w-full bg-slate-600 text-white py-3 rounded-full hover:bg-slate-700 transition cursor-pointer flex justify-center items-center gap-2 disabled:bg-slate-400"
                disabled={loading}
              >
                {loading && (
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                )}
                {loading ? "Sending..." : "Resend Email"}
              </button>
            </div>
          ) : (
            // Reset Password Form
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="relative">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password
                </label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-full focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-800"
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm New Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-full focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-800"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-600 text-white py-3 rounded-full hover:bg-slate-800 transition cursor-pointer"
                disabled={loading}
              >
                {loading && (
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                )}
                {loading ? "Reseting..." : "Reset your password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default PasswordReset;
