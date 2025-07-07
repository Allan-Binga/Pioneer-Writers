import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import {
  Mail,
  Phone,
  MapPin,
  BadgeCheck,
  Star,
  BookOpenCheck,
  UserCheck,
  Layers,
  CircleCheck,
} from "lucide-react";
import { endpoint } from "../../server";
import axios from "axios";
import { useState, useEffect } from "react";
import { notify } from "../../utils/toast";
import moment from "moment";

function Writers() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWriters = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${endpoint}/writers/all`);
        setWriters(response.data);
      } catch (error) {
        notify.info("Failed to fetch orders");
        console.error("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchWriters();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div className="flex">
        {/* Main Content Area */}
        <main className="flex-1 transition-all duration-300 md:ml-64 pt-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Writers</h1>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <span className="text-lg text-gray-500">
                  Loading writers...
                </span>
              </div>
            ) : writers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-gray-200">
                <p className="text-lg text-gray-500">No writers found.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {writers.map((writer) => (
                  <div
                    key={writer.writer_id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6 flex flex-col lg:flex-row items-start gap-6"
                  >
                    {/* Profile */}
                    <img
                      src={writer.profile_picture_url}
                      alt={writer.full_name}
                      className="w-20 h-20 rounded-full object-cover shadow"
                    />

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex justify-between flex-wrap">
                        <h2 className="text-xl font-semibold text-gray-800">
                          {writer.full_name}
                        </h2>
                        <span className="text-sm text-gray-400">
                          ID: {writer.writer_id}
                        </span>
                      </div>

                      <p className="text-sm italic text-gray-600 mt-1">
                        {writer.bio}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-4 text-md text-gray-700">
                        <WriterDetail icon={Mail} label={writer.email} />
                        <WriterDetail
                          icon={Phone}
                          label={writer.phone_number}
                        />
                        <WriterDetail
                          icon={MapPin}
                          label={`${writer.state}, ${writer.country}`}
                        />
                        <WriterDetail
                          icon={BadgeCheck}
                          label={`Level: ${writer.writer_level}`}
                        />
                        <WriterDetail
                          icon={UserCheck}
                          label={`Type: ${writer.writer_type}`}
                        />
                        <WriterDetail
                          icon={Layers}
                          label={`Field: ${writer.primary_topic_field.replace(
                            /-/g,
                            " "
                          )}`}
                        />
                        <WriterDetail
                          icon={BookOpenCheck}
                          label={`Orders: ${writer.completed_orders}`}
                        />
                        <WriterDetail
                          icon={Star}
                          label={`Rating: ${writer.rating}`}
                        />
                        <WriterDetail
                          icon={CircleCheck}
                          label={
                            writer.is_available ? "Available" : "Unavailable"
                          }
                          iconClassName={
                            writer.is_available
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        />
                        <p className="text-gray-500 col-span-full mt-2">
                          Joined:{" "}
                          {moment(writer.joined_at).format("MMM Do, YYYY")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function WriterDetail({
  icon: Icon,
  label,
  iconClassName = "text-indigo-500",
}) {
  return (
    <p className="flex items-center gap-2">
      <Icon className={`w-4 h-4 ${iconClassName}`} />
      {label}
    </p>
  );
}

export default Writers;
