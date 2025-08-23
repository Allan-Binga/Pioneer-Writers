import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  Mail,
  Phone,
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
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWriters = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${endpoint}/writers/my-writers`, {
          withCredentials: true,
        });
        setWriters(response.data.writers);
      } catch (error) {
        notify.info("Failed to fetch writers.");
        console.error("Failed to fetch writers.");
      } finally {
        setLoading(false);
      }
    };
    fetchWriters();
  }, []);

  function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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
      <div className="flex">
        {/* Main Content Area */}
        <main className="flex-1 transition-all duration-300 pt-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-800 mb-4 mt-8">
              Writers
            </h1>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <span className="text-base text-gray-500">
                  Loading writers...
                </span>
              </div>
            ) : writers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-gray-200">
                <p className="text-base text-gray-500">No writers found.</p>
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
                        <h2 className="text-lg font-semibold text-gray-800">
                          {writer.full_name}
                        </h2>
                        <span className="text-xs text-gray-400">
                          ID: {writer.writer_id}
                        </span>
                      </div>

                      <p className="text-xs italic text-gray-600 mt-1">
                        {writer.bio}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-4 text-sm text-gray-700">
                        <WriterDetail icon={Mail} label={writer.email} />
                        <WriterDetail
                          icon={Phone}
                          label={`Phone: ${writer.phone_number}`}
                        />

                        <WriterDetail
                          icon={BadgeCheck}
                          label={`Level: ${capitalize(writer.writer_level)}`}
                        />
                        <WriterDetail
                          icon={UserCheck}
                          label={`Type: ${capitalize(writer.writer_type)}`}
                        />
                        <WriterDetail
                          icon={Layers}
                          label={`Field: ${capitalize(
                            writer.primary_topic_field
                          )}`}
                        />
                        <WriterDetail
                          icon={BookOpenCheck}
                          label={`Orders: ${writer.completed_orders}`}
                        />
                        <WriterDetail
                          icon={Star}
                          label={`Rating: ${Number(
                            writer.average_rating
                          ).toFixed(1)}`}
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
                        <p className="text-gray-500 col-span-full mt-2 text-xs">
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
      <Footer />
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
