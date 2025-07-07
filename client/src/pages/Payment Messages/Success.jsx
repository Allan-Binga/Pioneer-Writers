import { useState, useEffect } from "react";
import axios from "axios";
import { notify } from "../../utils/toast";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { CheckCircle } from "lucide-react";
import { endpoint } from "../../server";

function Success() {
  const [showSidebar, setShowSidebar] = useState(false)
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${endpoint}/payments/all/my-payments`,
          { withCredentials: true }
        );
        setPayments(response.data);
      } catch (error) {
        notify.info("Failed to fetch payments");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <div className="flex">
       <Sidebar/>

        <main className="flex-1 transition-all duration-300 md:ml-64 pt-20 px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* ✅ Success Banner */}
            <div className="bg-green-100 border border-green-300 text-green-800 px-6 py-4 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h2 className="font-semibold text-lg">Payment Successful!</h2>
                <p>Your payment has been processed. Thank you!</p>
              </div>
            </div>

            {/* ✅ Payment Table */}
            <div className="bg-white shadow rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-slate-700 mb-4">
                Your Recent Payments
              </h3>

              {loading ? (
                <p className="text-gray-500">Loading payments...</p>
              ) : payments.length === 0 ? (
                <p className="text-gray-500">No payments found yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">
                          Order ID
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">
                          Amount
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {payments.map((payment, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2">{payment.order_id}</td>
                          <td className="px-4 py-2">${payment.amount}</td>
                          <td className="px-4 py-2">
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
                                payment.payment_status?.toLowerCase() === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {payment.payment_status}
                            </span>
                          </td>

                          <td className="px-4 py-2">
                            {new Date(payment.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Success;
