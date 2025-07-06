import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import {
  User,
  Mail,
  Phone,
  Save,
  Lock,
  ImagePlus,
  Loader2,
} from "lucide-react";
import { useState } from "react";

function Profile() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  // Dummy user data (would be fetched from API)
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+254712345678",
    bio: "A passionate writer who enjoys helping others with academic success.",
    avatar: null,
  });

  const toggleMobileSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    setUserData({ ...userData, avatar: URL.createObjectURL(file) });
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Profile updated!");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar toggleMobileSidebar={toggleMobileSidebar} />
      <div className="flex">
        <div className={`fixed z-40 md:static ${isSidebarOpen ? "block" : "hidden"} md:block`}>
          <Sidebar />
        </div>

        <main className="flex-1 transition-all duration-300 md:ml-64 pt-20 px-4">
          <div className="max-w-6xl mx-auto space-y-10">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">My Profile</h1>

            {/* Section 1: Personal Info */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-700 mb-4">Personal Information</h2>
              <div className="space-y-4">
                <InfoRow icon={User} label="Name" value={userData.name} />
                <InfoRow icon={Mail} label="Email" value={userData.email} />
                <InfoRow icon={Phone} label="Phone" value={userData.phone} />
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={smsEnabled}
                    onChange={() => setSmsEnabled(!smsEnabled)}
                    className="w-4 h-4 text-sky-600 border-gray-300 focus:ring-sky-500"
                  />
                  <span className="text-sm text-gray-700">
                    Enable SMS notifications for order updates
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Bio</h3>
                  <p className="text-sm text-gray-600">{userData.bio}</p>
                </div>
              </div>
            </div>

            {/* Section 2: Edit Profile */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-700 mb-4">Edit Profile</h2>
              <div className="space-y-5">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  {userData.avatar ? (
                    <img
                      src={userData.avatar}
                      alt="avatar"
                      className="w-16 h-16 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                  <label className="text-sm text-sky-600 hover:underline cursor-pointer flex items-center gap-1">
                    <ImagePlus className="w-4 h-4" />
                    Change Avatar
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>

                {/* Name */}
                <InputField
                  label="Name"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                />

                {/* Email */}
                <InputField
                  label="Email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                />

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    rows="3"
                    value={userData.bio}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
              </div>
            </div>

            {/* Optional: Reset Password */}
            <div className="text-right">
              <button className="text-sm text-sky-600 hover:underline flex items-center gap-1">
                <Lock className="w-4 h-4" />
                Reset Password
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Info Row Component
function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-700">
      <Icon className="w-4 h-4 text-sky-500" />
      <span className="font-medium">{label}:</span>
      <span>{value}</span>
    </div>
  );
}

// Input Field Component
function InputField({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
    </div>
  );
}

export default Profile;
