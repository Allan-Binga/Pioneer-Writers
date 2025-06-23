import { Navigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import { Check, CloudUpload, X, FileText, ChevronDown } from "lucide-react";

function OrderPayment() {
  const steps = [
    { number: 1, title: "Assignment Instructions", completed: true },
    { number: 2, title: "Order Payment", current: true },
    { number: 3, title: "Order Confirmation", completed: false },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Progress Tracker */}
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 mb-8">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200 z-0">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                style={{ width: "33%" }}
              />
            </div>

            {steps.map((step, index) => (
              <div
                key={step.number}
                className="flex flex-col items-center relative z-10"
              >
                <div
                  className={`
              w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
              ${
                step.completed
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 border-purple-500 text-white"
                  : step.current
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 border-purple-500 text-white shadow-lg"
                  : "bg-white border-gray-300 text-gray-400"
              }
            `}
                >
                  {step.completed ? (
                    <Check size={16} />
                  ) : (
                    <span className="text-sm font-semibold">{step.number}</span>
                  )}
                </div>
                <span
                  className={`
              mt-2 text-sm font-medium text-center
              ${step.current ? "text-purple-600" : "text-gray-600"}
            `}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        
      </div>
    </div>
  );
}

export default OrderPayment;
