import Navbar from "../../components/Navbar";
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
} from "lucide-react";
import { useState } from "react";

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 px-4 md:px-10 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-semibold text-slate-800 mb-8">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map(({ label, icon: Icon, count, color }) => (
            <div
              key={label}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border border-slate-100 flex items-center space-x-5 group"
            >
              <div className={`p-4 rounded-full ${color}`}>
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xl font-semibold text-slate-800 group-hover:text-slate-900">
                  {label}
                </p>
                <p className="text-3xl font-bold text-slate-700">{count}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
