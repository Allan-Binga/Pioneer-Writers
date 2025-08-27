import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { endpoint } from "../../server";
import { notify } from "../../utils/toast";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchBids } from "../../utils/bids";
import moment from "moment";
import axios from "axios";
import { LoaderCircle } from "lucide-react";

function Bids() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState();
  const [showModal, setShowModal] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);

  useEffect(() => {
    async function getBids() {
      try {
        const data = await fetchBids(orderId);
        setBids(data);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    getBids();
  }, [orderId]);

  const handleAssignOrder = async (bidId, orderId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${endpoint}/bids/assign-writer/${bidId}`,
        {},
        { withCredentials: true }
      );
      notify.success(response.data.message);

      // Refresh bids
      const data = await fetchBids(orderId);
      setBids(data);

      // Redirect to order details
      navigate(`/order-details/${orderId}`);
    } catch (error) {
      notify.error(error.response?.data?.error || "Failed to assign writer");
    } finally {
      setLoading(false);
      setShowModal(false);
      setSelectedBid(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Animated Background Waves - Fixed z-index */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Top wave */}
        <svg
          className="absolute top-0 left-0 w-full h-[200px] opacity-10"
          viewBox="0 0 1000 200"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
          </defs>
          <path
            d="M0,200 Q250,50 500,200 T1000,200 L1000,0 L0,0 Z"
            fill="url(#wave1)"
            className="animate-pulse"
          />
        </svg>

        {/* Bottom wave */}
        <svg
          className="absolute bottom-0 left-0 w-full h-[200px] opacity-5"
          viewBox="0 0 1000 200"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>
          <path
            d="M0,0 Q250,150 500,0 T1000,0 L1000,200 L0,200 Z"
            fill="url(#wave2)"
            className="animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </svg>

        {/* Floating Particles */}
        {/* Left side */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute top-40 left-10 w-3 h-3 bg-pink-400 rounded-full animate-pulse opacity-50"></div>
        <div
          className="absolute bottom-28 left-16 w-2 h-2 bg-green-400 rounded-full animate-bounce opacity-40"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/5 w-4 h-4 bg-indigo-300 rounded-full animate-pulse opacity-30"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Right side */}
        <div
          className="absolute top-40 right-32 w-3 h-3 bg-amber-400 rounded-full animate-bounce opacity-40"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/4 w-2 h-2 bg-indigo-400 rounded-full animate-bounce opacity-50"
          style={{ animationDelay: "3s" }}
        ></div>
        <div className="absolute top-1/3 right-20 w-4 h-4 bg-green-300 rounded-full animate-pulse opacity-30"></div>
      </div>
      <Navbar />
      <main className="flex-1 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-base sm:text-base font-semibold text-slate-900 mt-8">
              Bids placed for order{" "}
              <span className="text-slate-600">#{orderId}</span>
            </h1>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 text-slate-600">
              <LoaderCircle className="animate-spin w-6 h-6" />
              <span>Loading bids...</span>
            </div>
          ) : bids.length === 0 ? (
            <div className="text-slate-500 text-center py-10">
              No bids have been placed for this order yet.
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-100 text-slate-800">
                  <tr>
                    <th className="px-6 py-3 text-center">Writer</th>
                    <th className="px-6 py-3 text-center">Rating</th>
                    <th className="px-6 py-3 text-center">Message</th>
                    <th className="px-6 py-3 text-center">Status</th>
                    <th className="px-6 py-3 text-center">Placed At</th>
                    <th className="px-6 py-3 text-center">Assignment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bids.map((bid) => (
                    <tr
                      key={bid.bid_id}
                      className="text-center border-b border-slate-200 last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-semibold">
                        {bid.full_name}
                      </td>
                      <td className="px-6 py-4 font-semibold text-emerald-400">
                        {bid.rating || "Newbie"}
                      </td>
                      <td className="px-6 py-4">{bid.message}</td>
                      <td className="px-6 py-4 capitalize">{bid.bid_status}</td>
                      <td className="px-6 py-4">
                        {moment(bid.created_at).format("MMM D, YYYY, h:mm A")}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedBid(bid.bid_id);
                            setShowModal(true);
                          }}
                          className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Are you sure you want to assign to this writer?
            </h2>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => handleAssignOrder(selectedBid, orderId)}
                className="px-4 py-2 rounded-md bg-emerald-500 text-white hover:bg-emerald-600 text-sm font-medium"
              >
                Yes, Assign
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedBid(null);
                }}
                className="px-4 py-2 rounded-md bg-slate-200 text-slate-700 hover:bg-slate-300 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bids;
