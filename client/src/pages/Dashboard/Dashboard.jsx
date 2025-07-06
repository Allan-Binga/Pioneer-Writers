import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import {
  CheckCircle,
  LoaderCircle,
  FileText,
  Ban,
  AlertTriangle,
  FileClock,
  FileEdit,
  DollarSign,
  Inbox,
  Menu,
} from "lucide-react";

const dashboardItems = [
  {
    label: "Completed Orders",
    icon: CheckCircle,
    count: 132,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    label: "Orders In Progress",
    icon: LoaderCircle,
    count: 45,
    color: "bg-blue-100 text-blue-600",
  },
  {
    label: "All Orders",
    icon: FileText,
    count: 210,
    color: "bg-slate-100 text-slate-600",
  },
  {
    label: "Disputed Orders",
    icon: AlertTriangle,
    count: 6,
    color: "bg-red-100 text-red-600",
  },
  {
    label: "Unconfirmed Orders",
    icon: FileClock,
    count: 12,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    label: "Draft Orders",
    icon: FileEdit,
    count: 9,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    label: "Paid Orders",
    icon: DollarSign,
    count: 128,
    color: "bg-green-100 text-green-600",
  },
  {
    label: "Canceled Orders",
    icon: Ban,
    count: 14,
    color: "bg-rose-100 text-rose-600",
  },
  {
    label: "Submitted Orders",
    icon: Inbox,
    count: 82,
    color: "bg-sky-100 text-sky-600",
  },
];

function Dashboard() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar
        toggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />
      <Sidebar
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      />
      <main
        className={`pt-20 transition-all duration-300 ${
          isMobileSidebarOpen ? "ml-0" : "ml-0 md:ml-20 lg:ml-72"
        } px-4 sm:px-6 lg:px-8`}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">
            Dashboard
          </h1>
          <button
            className="md:hidden p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {dashboardItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="bg-white p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border border-slate-100 flex items-center space-x-4 sm:space-x-5 group"
              >
                <div
                  className={`p-3 sm:p-4 rounded-full ${item.color} transition-all duration-300`}
                >
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <p className="text-base sm:text-xl font-semibold text-slate-800 group-hover:text-slate-900">
                    {item.label}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-700">
                    {item.count}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
