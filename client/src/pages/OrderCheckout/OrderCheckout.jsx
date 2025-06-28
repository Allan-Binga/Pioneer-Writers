import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { Check } from "lucide-react";
import { endpoint } from "../../server";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

function OrderCheckout() {
  const navigate = useNavigate();
  const [steps, setSteps] = useState([
    {
      number: 1,
      title: "Assignment Instructions",
      current: false,
      completed: true,
    },
    { number: 2, title: "Order Payment", current: false, completed: true },
    {
      number: 3,
      title: "Order Confirmation",
      current: true,
      completed: false,
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <Navbar />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Progress Tracker */}
          <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200 z-0">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                  style={{ width: "33%" }}
                />
              </div>
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center relative z-10"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      step.completed
                        ? "bg-gradient-to-r from-purple-500 to-indigo-500 border-purple-500 text-white"
                        : step.current
                        ? "bg-gradient-to-r from-purple-500 to-indigo-500 border-purple-500 text-white shadow-lg"
                        : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    {step.completed ? (
                      <Check size={16} />
                    ) : (
                      <span className="text-sm font-semibold">
                        {step.number}
                      </span>
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium text-center ${
                      step.current ? "text-purple-600" : "text-gray-600"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <p>This is the order checkout.</p>
    </div>
  );
}

export default OrderCheckout;
