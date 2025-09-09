import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import AuthenticateRoute from "./components/AuthenticateRoute";
import NewOrder from "./pages/NewOrder/NewOrder";
import Landing from "./pages/LandingPage/Landing";
import SignUp from "./pages/SignUp/SignUp";
import SignIn from "./pages/SignIn/SignIn";
import OrderConfirmation from "./pages/OrderConfirmation/OrderConfirmation";
import MyOrders from "./pages/Orders/MyOrders";
import Bids from "./pages/Orders/Bids";
import Wallet from "./pages/Wallet/Wallet";
import Inbox from "./pages/Inbox/Inbox";
import Writers from "./pages/Writers/Writers";
import TopWriters from "./pages/Writers/TopWriters";
import Settings from "./pages/Profile/Settings";
import Profile from "./pages/Profile/Profile";
import News from "./pages/News/News";
import OrderCheckout from "./pages/OrderCheckout/OrderCheckout";
import Success from "./pages/Payment Messages/Success";
import Failure from "./pages/Payment Messages/Failure";
import TermsAndConditions from "./pages/TermsOfUse/TermsAndConditions";
import PrivacyPolicy from "./pages/TermsOfUse/PrivacyPolicy";
import FairUsePolicy from "./pages/TermsOfUse/FairUsePolicy";
import DataDeletion from "./pages/TermsOfUse/DataDeletion";
import Drafts from "./pages/Orders/Drafts";
import Home from "./pages/Home/Home";
import OrderDetails from "./pages/Orders/OrderDetails";
import PasswordReset from "./pages/PasswordReset/PasswordReset";
import Payments from "./pages/Payments/Payments";
import ClassHelp from "./pages/ClassHelp/ClassHelp";
import ClassPayment from "./pages/ClassHelp/ClassPayment";
import ClassSuccess from "./pages/Payment Messages/ClassSuccess";
import ClassFailure from "./pages/Payment Messages/ClassFailure";
import AboutUs from "./pages/PioneerPages/AboutUs";
import ContactUs from "./pages/PioneerPages/ContactUs";
import Faqs from "./pages/PioneerPages/Faq";
import PioneerHome from "./pages/PioneerPages/PioneerHome";

function App() {
  return (
    <Router>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/sign-up" />} />

        {/* Public routes (not protected) */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/password/reset" element={<PasswordReset />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/use-policy" element={<FairUsePolicy />} />
        <Route path="/data-deletion" element={<DataDeletion />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/home/home" element={<PioneerHome />} />
        {/* Protected routes (wrapped with AuthenticateRoute) */}
        <Route
          path="/new-order"
          element={
            <AuthenticateRoute>
              <NewOrder />
            </AuthenticateRoute>
          }
        />
        <Route
          path="/class-help"
          element={
            <AuthenticateRoute>
              <ClassHelp />
            </AuthenticateRoute>
          }
        />
        <Route
          path="/class-checkout"
          element={
            <AuthenticateRoute>
              <ClassPayment />
            </AuthenticateRoute>
          }
        />
        <Route
          path="/payment/class/success"
          element={
            <AuthenticateRoute>
              <ClassSuccess />
            </AuthenticateRoute>
          }
        />
        <Route
          path="/payment/class/failed"
          element={
            <AuthenticateRoute>
              <ClassFailure />
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
        <Route
          path="/bids/order/:orderId"
          element={
            <AuthenticateRoute>
              <Bids />
            </AuthenticateRoute>
          }
        />
        <Route
          path="/drafts"
          element={
            <AuthenticateRoute>
              <Drafts />
            </AuthenticateRoute>
          }
        />

        <Route
          path="/order-confirmation"
          element={
            <AuthenticateRoute>
              <OrderConfirmation />
            </AuthenticateRoute>
          }
        />
        <Route
          path="/home"
          element={
            <AuthenticateRoute>
              <Home />
            </AuthenticateRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <AuthenticateRoute>
              <Wallet />
            </AuthenticateRoute>
          }
        />
        <Route
          path="/inbox"
          element={
            <AuthenticateRoute>
              <Inbox />
            </AuthenticateRoute>
          }
        />
        <Route
          path="/writers"
          element={
            <AuthenticateRoute>
              <Writers />
            </AuthenticateRoute>
          }
        />
        <Route
          path="/top-writers"
          element={
            <AuthenticateRoute>
              <TopWriters />
            </AuthenticateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <AuthenticateRoute>
              <Settings />
            </AuthenticateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthenticateRoute>
              <Profile />
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
        <Route
          path="/order-checkout"
          element={
            <AuthenticateRoute>
              <OrderCheckout />
            </AuthenticateRoute>
          }
        />
        <Route
          path="/payment/success"
          element={
            <AuthenticateRoute>
              <Success />
            </AuthenticateRoute>
          }
        />
        <Route
          path="/payment/failed"
          element={
            <AuthenticateRoute>
              <Failure />
            </AuthenticateRoute>
          }
        />
        <Route
          path="/payment-history"
          element={
            <AuthenticateRoute>
              <Payments />
            </AuthenticateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
