import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { endpoint } from "../../server";
import axios from "axios";
import { useState, useEffect } from "react";
import { notify } from "../../utils/toast";
import UserImage from "../../assets/user.png";
import { useParams } from "react-router-dom";
import { LoaderCircle, FileText } from "lucide-react";

function UserDetails() {
  const { clientId } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${endpoint}/users/clients/${clientId}`,
          { withCredentials: true }
        );
        setUser(response.data.user);
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error("Error fetching user:", error);
        notify.error("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [clientId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoaderCircle className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-32 text-slate-600">
        <p>User not found or an error occurred.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4 mt-12 mb-8">
            <img
              src={user.avatar_url || UserImage}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{user.username}</h1>
              <p className="text-slate-600">{user.email}</p>
              <p className="text-slate-500">{user.phone_number || "No phone provided"}</p>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Orders</h2>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-10 w-10 text-slate-400" />
                <p className="text-sm text-slate-500 mt-2">This user has no orders yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl shadow-sm bg-white border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Order ID</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Title</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Status</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Created At</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {orders.map((order) => (
                      <tr key={order.order_id}>
                        <td className="px-6 py-4">{order.order_id}</td>
                        <td className="px-6 py-4">{order.topic}</td>
                        <td className="px-6 py-4 capitalize text-slate-700">{order.order_status}</td>
                        <td className="px-6 py-4 text-slate-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                          <td className="px-6 py-4 capitalize text-slate-700">{order.writer_id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default UserDetails;
