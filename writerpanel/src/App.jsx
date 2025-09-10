import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import AuthenticateRoute from "./components/AuthenticateRoute";
import SignUp from "./pages/Authentication/SignUp";
import SignIn from "./pages/Authentication/SignIn";
import ProfileCompletion from "./pages/Profile/ProfileCompletion";
import Profile from "./pages/Profile/Profile";
import Payments from "./pages/Payments/Payments";
import Orders from "./pages/Orders/Orders";
import OrderDetails from "./pages/Orders/OrderDetails";
import MyOrders from "./pages/Orders/MyOrders";
import Classes from "./pages/Orders/Classes";
import Inbox from "./pages/Services/Inbox";
import News from "./pages/Services/News";
import TermsAndConditions from "./pages/PioneerPages/TermsAndConditions";
import FairUsePolicy from "./pages/PioneerPages/FairUsePolicy";
import BackgroundWaves from "./components/BackgroundWaves";
import PrivacyPolicy from "./pages/PioneerPages/PrivacyPolicy";
import AboutUs from "./pages/PioneerPages/AboutUs";
import ContactUs from "./pages/PioneerPages/ContactUs";
import Faqs from "./pages/PioneerPages/Faq";

function App() {
  return (
    <Router>
      <BackgroundWaves />
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/sign-up" />} />
        <Route path="/landing" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/profile-completion" element={<ProfileCompletion />} />
        <Route
          path="/profile"
          element={
            <AuthenticateRoute>
              <Profile />
            </AuthenticateRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <AuthenticateRoute>
              <Payments />
            </AuthenticateRoute>
          }
        />
        <Route
          path="/public-orders"
          element={
            <AuthenticateRoute>
              <Orders />
            </AuthenticateRoute>
          }
        />
        <Route
          path="/my-orders/:status"
          element={
            <AuthenticateRoute>
              <MyOrders />
            </AuthenticateRoute>
          }
        />
        <Route
          path="/order-details/:orderId"
          element={
            <AuthenticateRoute>
              <OrderDetails />
            </AuthenticateRoute>
          }
        />
        <Route path="/classes" element={<Classes />} />
        <Route
          path="/inbox"
          element={
            <AuthenticateRoute>
              <Inbox />
            </AuthenticateRoute>
          }
        />
        <Route
          path="/news"
          element={
            <AuthenticateRoute>
              <News />
            </AuthenticateRoute>
          }
        />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/fair-use-policy" element={<FairUsePolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/faqs" element={<Faqs />} />
      </Routes>
    </Router>
  );
}

export default App;
