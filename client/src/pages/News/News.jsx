import { useState, useEffect } from "react";
import axios from "axios";
import { CalendarDays } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { endpoint } from "../../server";
import { notify } from "../../utils/toast";

function News() {
  const [activeTab, setActiveTab] = useState("unread");
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch News
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${endpoint}/news/fetch-news`, {
          withCredentials: true,
        });
        setNews(response.data || []);
      } catch (error) {
        notify.error("Failed to fetch news");
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Mark news as read
  const markAsRead = async (newsId) => {
    try {
      await axios.patch(
        `${endpoint}/news/${newsId}/mark-read`,
        { is_unread: false },
        { withCredentials: true }
      );
      setNews((prev) =>
        prev.map((item) =>
          item.news_id === newsId ? { ...item, is_unread: false } : item
        )
      );
    } catch (error) {
      console.error("Error marking news as read:", error);
      notify.error("Failed to mark news as read");
    }
  };

  const displayedNews =
    activeTab === "unread" ? news.filter((item) => item.is_unread) : news;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
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
      <main className="flex-1 transition-all duration-300 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-8 mt-10">
            News & Updates
          </h1>

          {/* Tabs */}
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("unread")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeTab === "unread"
                  ? "bg-slate-600 text-white"
                  : "bg-white text-slate-600 border border-slate-300"
              }`}
            >
              Unread News
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeTab === "all"
                  ? "bg-slate-600 text-white"
                  : "bg-white text-slate-600 border border-slate-300"
              }`}
            >
              All News
            </button>
          </div>

          {/* News Cards */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <svg
                  className="animate-spin h-6 w-6 text-slate-600"
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
              </div>
            ) : displayedNews.length === 0 ? (
              <div className="text-gray-600 text-center py-16">
                No news in this section.
              </div>
            ) : (
              displayedNews.map((newsItem) => (
                <div
                  key={newsItem.news_id}
                  className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition cursor-pointer"
                  onClick={() =>
                    newsItem.is_unread && markAsRead(newsItem.news_id)
                  }
                >
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold text-slate-800">
                      {newsItem.title}
                    </h2>
                    {newsItem.is_unread && (
                      <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-medium">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{newsItem.body}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                    <CalendarDays className="w-4 h-4" />
                    <span>{new Date(newsItem.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default News;
