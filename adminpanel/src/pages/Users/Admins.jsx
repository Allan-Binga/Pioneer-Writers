import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { endpoint } from "../../server";
import axios from "axios";
import { useState, useEffect } from "react";
import { notify } from "../../utils/toast";
import { LoaderCircle, FileText } from "lucide-react";
import UserImage from "../../assets/user.png";
import { useNavigate } from "react-router-dom";

function Administrators() {
  const [administrators, setAdministrators] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${endpoint}/users/administrators`, {
          withCredentials: true,
        });
        setAdministrators(response.data);
      } catch (error) {
        notify.error("Failed to fetch administrators");
        console.error("Error fetching administrators:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold text-slate-900 mb-6 mt-8">
            Administrators
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-60">
              <LoaderCircle className="animate-spin w-8 h-8 text-blue-500" />
            </div>
          ) : administrators.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-2 text-slate-600 text-sm">
                No administrators to display at the moment.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl shadow-sm bg-white border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-slate-600">
                      Profile Picture
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-600">
                      Full Name
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-600">
                      Phone Number
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-600">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {administrators.map((administrator) => (
                    <tr
                      key={administrator.id}
                      onClick={() => handleRowClick(administrator.admin_id)}
                      className="hover:bg-slate-50 cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <img
                          src={administrator.avatar_url || UserImage}
                          alt="avatar"
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {administrator.full_name}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {administrator.phone_number || "-"}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {administrator.email}
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

export default Administrators;
