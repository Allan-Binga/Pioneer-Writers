import { useState, useEffect } from "react";
import axios from "axios";
import { FileText, LoaderCircle, Trash2, User } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { endpoint } from "../../server";
import { notify } from "../../utils/toast";
import UserImage from "../../assets/user.png";
import { Link, useParams } from "react-router-dom";

function WriterDetails() {
  const { writerId } = useParams();
  const [writer, setWriter] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWriter = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${endpoint}/users/writers/${writerId}`,
          { withCredentials: true }
        );
        setWriter(response.data.writer);
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error("Error fetching writer:", error);
        notify.error("Failed to fetch writer");
      } finally {
        setLoading(false);
      }
    };

    fetchWriter();
  }, [writerId]);

  const handleSuspendWriter = async (id) => {
    try {
      await axios.post(
        `${endpoint}/users/writers/${id}/suspend`,
        {},
        { withCredentials: true }
      );
      notify.success("Writer suspended successfully");
      setWriter((prev) => ({ ...prev, status: "suspended" }));
    } catch (error) {
      console.error(error);
      notify.error("Failed to suspend writer");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
        <svg
          className="animate-spin h-8 w-8 text-slate-600"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
        <span className="ml-2 text-slate-600">Loading...</span>
      </div>
    );
  }

  if (!writer) {
    return (
      <div className="text-center mt-32 text-slate-600 bg-gradient-to-br from-slate-50 to-indigo-50 min-h-screen">
        <p>Writer not found or an error occurred.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <Navbar />
      <main className="flex-1 pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold text-slate-800 mb-6 mt-8 flex items-center">
            <User className="w-8 h-8 mr-2 text-slate-600" />
            Writer Details
          </h1>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center space-x-4 mb-6">
              <img
                src={writer.avatar_url || UserImage}
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  {writer.username}
                </h2>
                <p className="text-sm text-slate-600">{writer.email}</p>
                <p className="text-sm text-slate-500">
                  {writer.phone_number || "No phone provided"}
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Expertise:</strong>{" "}
                  {writer.expertise || "Not specified"}
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`capitalize ${
                      writer.status === "active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {writer.status || "Unknown"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleSuspendWriter(writer.writer_id)}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Suspend Writer
              </button>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-3xl font-semibold text-slate-800 mb-6 flex items-center">
              Assigned Orders
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-10 w-10 text-slate-400" />
                  <p className="text-sm text-slate-500 mt-2">
                    This writer has no assigned orders yet.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold text-slate-600">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-slate-600">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-slate-600">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-slate-600">
                          Client ID
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-slate-600">
                          Created At
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-slate-600">
                          Deadline
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                      {orders.map((order) => (
                        <tr
                          key={order.order_id}
                          className="hover:bg-slate-50 transition"
                        >
                          <td className="px-6 py-4">
                            <Link to={`/order-details/${order.order_id}`}>
                              {order.order_id}
                            </Link>
                          </td>
                          <td className="px-6 py-4">{order.topic}</td>
                          <td className="px-6 py-4 capitalize text-slate-700">
                            {order.order_status}
                          </td>
                          <td className="px-6 py-4">{order.user_id}</td>
                          <td className="px-6 py-4 text-slate-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {order.deadline
                              ? new Date(order.deadline).toLocaleDateString()
                              : "Not set"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default WriterDetails;
