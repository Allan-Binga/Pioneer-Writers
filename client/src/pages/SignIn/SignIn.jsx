import React from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, BookCopy } from "lucide-react";
import GoogleIcon from "../../assets/google.png";
import FacebookIcon from "../../assets/facebook.png";
import AppleIcon from "../../assets/apple.png";

const SignIn = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex">
      {/* Left Column */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 bg-gradient-to-br from-purple-200 to-purple-300">
        <div className="mb-8 p-8 bg-white rounded-full shadow-lg">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
            <BookCopy  className="w-16 h-16 text-white"/>
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
              New to Pioneer Writers? <Link to="/sign-up" className="text-purple-700 hover:underline">Sign Up Now</Link>
            </p>
          </div>

          <form className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-10 py-2 border border-purple-300 rounded-full focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 py-2 border border-purple-300 rounded-full focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-purple-700 hover:underline">Forgot password?</Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
            >
              Log in
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-purple-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-purple-600">
                Or log in with
              </span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button className="group border border-gray-300 p-4 rounded-full bg-white transition-colors duration-200 hover:border-purple-700 cursor-pointer">
              <img src={GoogleIcon} alt="Google" className="w-6 h-6 mx-auto" />
            </button>
            <button className="group border border-gray-300 p-4 rounded-full bg-white transition-colors duration-200 hover:border-purple-700 cursor-pointer">
              <img src={FacebookIcon} alt="Facebook" className="w-6 h-6 mx-auto" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;