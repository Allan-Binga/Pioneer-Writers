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
