import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import { Toaster } from "sonner";
import NewOrder from "./pages/NewOrder/NewOrder";
import Landing from "./pages/LandingPage/Landing";
import SignUp from "./pages/SignUp/SignUp";
import SignIn from "./pages/SignIn/SignIn";
import OrderConfirmation from "./pages/OrderConfirmation/OrderConfirmation";
import MyOrders from "./pages/Orders/MyOrders";
import Dashboard from "./pages/Dashboard/Dashboard";
import Wallet from "./pages/Wallet/Wallet";
import Inbox from "./pages/Inbox/Inbox";
import Writers from "./pages/Writers/Writers";
import Settings from "./pages/Profile/Settings";
import Profile from "./pages/Profile/Profile";
import News from "./pages/News/News";
import OrderCheckout from "./pages/OrderCheckout/OrderCheckout";
import Success from "./pages/Payment Messages/Success";
import Failure from "./pages/Payment Messages/Failure";
import Terms from "./pages/TermsOfUse/Terms";
import PrivacyPolicy from "./pages/TermsOfUse/PrivacyPolicy";
import DataDeletion from "./pages/TermsOfUse/DataDeletion";

function App() {
  return (
    <Router>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/sign-in" />} />
        <Route path="/home" element={<Landing />} />
        <Route path="/new-order" element={<Layout><NewOrder /></Layout>} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/order-confirmation" element={<Layout><OrderConfirmation/></Layout>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/writers" element={<Writers />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/news" element={<News />} />
        <Route path="/order-checkout" element={<Layout><OrderCheckout/></Layout>} />
        <Route path="/payment/successful" element={<Success />} />
        <Route path="/payment/failed" element={<Failure />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/data-deletion" element={<DataDeletion />} />
      </Routes>
    </Router>
  );
}

export default App;
