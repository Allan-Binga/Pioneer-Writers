import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  User,
  Mail,
  Phone,
  Save,
  ImagePlus,
  Loader2,
  UserPen,
  GraduationCap,
  StarIcon,
  Star,
} from "lucide-react";
import { useState, useEffect } from "react";
import { fetchProfile } from "../../utils/profile";
import { fetchRatings } from "../../utils/rating";
import axios from "axios";
import { notify } from "../../utils/toast";
import { backend } from "../../backend";

function Profile() {
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [rating, setRating] = useState({});
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    writer_id: "",
    full_name: "",
    email: "",
    phone_number: "",
    bio: "",
    writer_level: "",
    writer_type: "",
    profile_picture_url: "",
    sms_updates: "",
    completed_orders: "",
    joined_at: "",
    avatarFile: null,
  });

  useEffect(() => {
    if (userData?.writer_id) {
      fetchRatings(userData.writer_id)
        .then((data) => setRating(data))
        .catch((err) => console.error(err));
    }
  }, [userData?.writer_id]);

  // helper to render stars
  function StarRating({ value }) {
    const stars = [];
    const rounded = Math.round(value); // round to nearest int
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-5 h-5 ${
            i <= rounded ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
          }`}
        />
      );
    }
    return <div className="flex">{stars}</div>;
  }

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const profile = await fetchProfile();
        setUserData({
          writer_id: profile.writer_id || "",
          bio: profile.bio || "",
          full_name: profile.full_name || "",
          email: profile.email || "",
          phone_number: profile.phone_number || "",
          profile_picture_url: profile.profile_picture_url || "",
          writer_level: profile.writer_level || "",
          writer_type: profile.writer_type || "",
          completed_orders: profile.completed_orders || "",
          joined_at: profile.joined_at || "",
          avatarFile: null,
          sms_updates: profile.sms_updates || "",
        });
        setSmsEnabled(profile.sms_updates || false);
      } catch (err) {
        console.error("Failed to fetch profile:", err.message);
      }
    };

    getProfileData();
  }, []);

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData((prev) => ({
        ...prev,
        avatarFile: file, // Save file for upload
        avatar: URL.createObjectURL(file), // For preview
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("full_name", userData.full_name);
      formData.append("phone_number", userData.phone_number);

      //Append avatar file if selected
      if (userData.avatarFile) {
        formData.append("avatar", userData.avatarFile);
      }

      const response = await axios.patch(
        `${backend}/profile/writer/update-profile`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        notify.success("Profile updated successfully.");
        //Uodate avatar preview with new one
        setUserData((prev) => ({
          ...prev,
          avatar: response.data.user.profile_picture_url,
        }));
      } else {
        notify.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      notify.error("An error occured while updating your profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleActivateSMS = async () => {
    if (smsEnabled) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${backend}/sms/writer/activate-sms`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        notify.success("SMS notifications activated!");
        setSmsEnabled(true);
      } else {
        notify.error(response.data.message || "Failed to activate SMS");
      }
    } catch (error) {
      console.error("Activate SMS error:", error);
      notify.error("An error occured while activating SMS");
    } finally {
      setLoading(false);
    }
  };

  //Deactivate SMS
  const handleDeactivateSMS = async () => {
    if (!smsEnabled) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${backend}/sms/writer/deactivate-sms`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        notify.success("SMS notifications deactivated!");
        setSmsEnabled(false); // update toggle
      } else {
        notify.error(response.data.message || "Failed to deactivate SMS.");
      }
    } catch (error) {
      console.error("Deactivation SMS error:", error);
      notify.error("An error occurred while deactivating SMS");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <main className="flex-1 pt-20 px-4">
        <div className="max-w-5xl mx-auto space-y-10">
          <h1 className="text-2xl font-bold text-slate-800 mb-8 mt-8">
            My Profile
          </h1>

          {/* Section 1: Personal Info */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-700 mb-4">
              Personal Information
            </h2>
            <div className="space-y-4">
              <InfoRow icon={User} label="Name" value={userData.full_name} />
              <InfoRow icon={Mail} label="Email" value={userData.email} />
              <InfoRow
                icon={Phone}
                label="Phone"
                value={userData.phone_number || "Not Set Up"}
              />
              <InfoRow
                icon={UserPen}
                label="Bio"
                value={userData.bio || "No bio provided"}
              />
              <InfoRow
                icon={GraduationCap}
                label="Level"
                value={
                  userData.writer_level.charAt(0).toUpperCase() +
                  userData.writer_level.slice(1)
                }
              />
              <InfoRow
                icon={StarIcon}
                label="Type"
                value={
                  userData.writer_type.charAt(0).toUpperCase() +
                  userData.writer_type.slice(1)
                }
              />

              {/* ⭐ Ratings */}
              {rating && (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-700">
                    Your Ratings:
                  </span>
                  <StarRating value={parseFloat(rating.average_rating)} />
                  <span className="text-sm text-slate-600 font-semibold">
                    ({rating.rating_count})
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <ToggleSwitch
                  isEnabled={smsEnabled}
                  onToggle={() => setShowSmsModal(true)} //Open the SMS modal toggle
                />

                <span className="text-sm text-gray-700">
                  {smsEnabled
                    ? "Disable SMS notifications for order updates"
                    : "Enable SMS notifications for order updates"}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Edit Profile */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-700 mb-4">
              Edit Profile
            </h2>
            <div className="space-y-5">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                {userData.profile_picture_url ? (
                  <img
                    src={userData.profile_picture_url}
                    alt="avatar"
                    className="w-16 h-16 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <User className="w-6 h-6" />
                  </div>
                )}
                <label className="text-sm text-slate-600 hover:underline cursor-pointer flex items-center gap-1">
                  <ImagePlus className="w-4 h-4" />
                  Change Avatar
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Form Fields */}
              <InputField
                label="Fullname"
                name="name"
                value={userData.full_name}
                onChange={handleInputChange}
              />
              <InputField
                label="Email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
              />
              <InputField
                label="Phone"
                name="phone"
                value={userData.phone_number}
                onChange={handleInputChange}
              />

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
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
        </div>
      </main>

      {/* SMS Modal for Toggling SMS UPDATES */}
      {showSmsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-80 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              {smsEnabled
                ? "Confirm SMS Deactivation"
                : "Confirm SMS Activation"}
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              {smsEnabled
                ? "Are you sure you want to disable SMS updates for order notifications?"
                : "Are you sure you want to activate SMS updates for order notifications?"}
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer"
                onClick={() => setShowSmsModal(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 text-white rounded-md cursor-pointer ${
                  smsEnabled
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                onClick={() => {
                  setShowSmsModal(false);
                  smsEnabled ? handleDeactivateSMS() : handleActivateSMS();
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

// Toggle Switch Component
function ToggleSwitch({ isEnabled, onToggle }) {
  return (
    <div
      onClick={onToggle}
      className={`w-10 h-5 flex items-center rounded-full cursor-pointer transition-all duration-300 ${
        isEnabled ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
          isEnabled ? "translate-x-5" : "translate-x-1"
        }`}
      ></div>
    </div>
  );
}

// Info Row Component
function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-700">
      <Icon className="w-4 h-4 text-slate-500" />
      <span className="font-medium">{label}:</span>
      <span>{value}</span>
    </div>
  );
}

// Input Field Component
function InputField({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-200 placeholder:text-sm"
      />
    </div>
  );
}

export default Profile;
