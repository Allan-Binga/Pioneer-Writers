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
      // Refresh bids list so status updates
      const data = await fetchBids(orderId);
      setBids(data);

      // Redirect to order details page
      navigate(`/order-details/${orderId}`);
    } catch (error) {
      notify.error(error.response?.data?.error || "Failed to assign writer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-base sm:text-base font-semibold text-slate-900  mt-8">
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
                    <th className="px-6 py-3 text-left">Writer</th>
                    <th className="px-6 py-3 text-left">Rating</th>
                    <th className="px-6 py-3 text-left">Message</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Placed At</th>
                    <th className="px-6 py-3 text-left">Assignment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bids.map((bid) => (
                    <tr
                      key={bid.bid_id}
                      className="border-b border-slate-200 last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-semibold">{bid.full_name}</td>
                      <td className="px-6 py-4 font-semibold text-emerald-400">
                        {bid.rating}
                      </td>
                      <td className="px-6 py-4">{bid.message}</td>
                      <td className="px-6 py-4 capitalize">{bid.bid_status}</td>
                      <td className="px-6 py-4">
                        {moment(bid.created_at).format("MMM D, YYYY, h:mm A")}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleAssignOrder(bid.bid_id, orderId)}
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
    </div>
  );
}

export default Bids;
