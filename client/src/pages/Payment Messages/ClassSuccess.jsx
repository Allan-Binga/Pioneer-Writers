import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { notify } from "../../utils/toast";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Spinner from "../../components/Spinner";
import { CheckCircle } from "lucide-react";
import { endpoint } from "../../server";
import PayPal from "../../assets/paypal.png";

function ClassSuccess() {
  const [classPayments, setClassPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(true);
  const [pollingAttempts, setPollAttempts] = useState(0);
  const maxPollingAttempts = 3;
  const pollingInterval = 2000;
  const hasCaptured = useRef(false); // Prevent multiple captures
  const minLoadingTime = 5000; // 5 seconds minimum loading time

  const formatDate = (dateString) => {
    const options = {
      month: "long",
      weekday: "short",
      day: "numeric",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const fetchClassPayments = async (classOrderId = null) => {
    try {
      const response = await axios.get(
        `${endpoint}/payments/class/all/my-payments`,
        {
          withCredentials: true,
        }
      );
      setClassPayments(response.data);

      if (classOrderId) {
        const classPayment = response.data.find(
          (p) => p.class_help_id === classOrderId
        );

        if (classPayment) {
          notify.success("Payment confirmed!");
          setPollAttempts(0);
          return true;
        } else if (pollingAttempts < maxPollingAttempts) {
          setPollAttempts((prev) => prev + 1);
          return false;
        } else {
          notify.success(
            "Payment is getting processed. Please gcheck back later."
          );
          return true;
        }
      } else {
        return true;
      }
    } catch (error) {
      console.error("Fetch error:", error);
      if (pollingAttempts >= maxPollingAttempts) {
        notify.error("Failed to fetch payments. Please try again later.");
        return true; // Stop polling
      } else {
        setPollAttempts((prev) => prev + 1);
        return false; // Continue polling
      }
    }
  };

  useEffect(() => {
    const token = searchParams.get("token");
    let interval;
    let isMinTimeElapsed = false;
    let isApiComplete = false;

    const handleLoadingState = () => {
      if (isMinTimeElapsed && isApiComplete) {
        setLoading(false);
      }
    };

    // Ensure minimum loading time of 5 seconds
    const minTimeTimeout = setTimeout(() => {
      isMinTimeElapsed = true;
      handleLoadingState();
    }, minLoadingTime);

    const captureAndFetchPayments = async () => {
      if (!token || hasCaptured.current) {
        const stopLoading = await fetchPayments();
        if (stopLoading) {
          isApiComplete = true;
          handleLoadingState();
        }
        return;
      }

      try {
        hasCaptured.current = true; // Mark as captured
        const captureResponse = await axios.post(
          `${endpoint}/payments/class-payments/capture`,
          { token },
          { withCredentials: true }
        );

        if (captureResponse.data.success) {
          notify.success(
            captureResponse.data.message || "Payment captured successfully."
          );

          localStorage.removeItem("step1Data");
          localStorage.removeItem("step2Data");
          localStorage.removeItem("checkoutAmount");
          localStorage.removeItem("order_id");
          localStorage.removeItem("orderData");

          const orderId = captureResponse.data.orderId;
          if (orderId) {
            const stopLoading = await fetchPayments(orderId);
            if (stopLoading) {
              isApiComplete = true;
              handleLoadingState();
            } else {
              interval = setInterval(async () => {
                if (pollingAttempts < maxPollingAttempts) {
                  const stopPolling = await fetchPayments(orderId);
                  if (stopPolling) {
                    clearInterval(interval);
                    isApiComplete = true;
                    handleLoadingState();
                  }
                } else {
                  clearInterval(interval);
                  isApiComplete = true;
                  handleLoadingState();
                }
              }, pollingInterval);
            }
          } else {
            const stopLoading = await fetchPayments();
            if (stopLoading) {
              isApiComplete = true;
              handleLoadingState();
            }
          }
        }
      } catch (error) {}
    };
  });
  return (
    <div>
      <p>Payment Successful</p>
    </div>
  );
}

export default ClassSuccess;
