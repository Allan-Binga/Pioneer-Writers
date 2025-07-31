import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { endpoint } from "../../server";
import axios from "axios";
import { useState, useEffect } from "react";
import { notify } from "../../utils/toast";
import { LoaderCircle, FileText } from "lucide-react";
import UserImage from "../../assets/user.png";
import { useNavigate } from "react-router-dom";

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${endpoint}/news/fetch-news`, {
          withCredentials: true,
        });
        setNews(response.data);
      } catch (error) {
        notify.error("Failed to fetch news");
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <Navbar />
      <main className="flex-1 pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold text-slate-800 mb-6 mt-8 flex items-center">
            Post News
          </h1>
          <form
            className="space-y-4 max-w-xl"
            onSubmit={async (e) => {
              e.preventDefault();
              const title = e.target.title.value;
              const body = e.target.body.value;

              try {
                setLoading(true);
                const res = await axios.post(
                  `${endpoint}/news/post-news`,
                  { title, body },
                  { withCredentials: true }
                );
                notify.success(res.data.message);
                setNews((prev) => [res.data.news, ...prev]);
                e.target.reset();
              } catch (err) {
                console.error(err);
                notify.error("Failed to post news.");
              } finally {
                setLoading(false);
              }
            }}
          >
            <input
              name="title"
              placeholder="News Title"
              className="w-full px-4 py-2 border rounded"
              required
            />
            <textarea
              name="body"
              placeholder="News Body"
              className="w-full px-4 py-2 border rounded"
              rows={4}
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Post News
            </button>
          </form>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">Recent News</h2>
          {loading ? (
            <p>Loading...</p>
          ) : news.length === 0 ? (
            <p>No news found.</p>
          ) : (
            <ul className="space-y-4">
              {news.map((n) => (
                <li
                  key={n.news_id}
                  className="p-4 border rounded bg-white shadow-sm"
                >
                  <h3 className="text-lg font-bold">{n.title}</h3>
                  <p className="text-sm text-gray-600">{n.date}</p>
                  <p className="mt-2">{n.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default News;
