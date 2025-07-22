import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import NewOrder from "./pages/NewOrder/NewOrder";
import Landing from "./pages/LandingPage/Landing";
import SignUp from "./pages/SignUp/SignUp";
import SignIn from "./pages/SignIn/SignIn";
import OrderConfirmation from "./pages/OrderConfirmation/OrderConfirmation";
import MyOrders from "./pages/Orders/MyOrders";
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
import DataDeletion from "./pages/TermsOfUse/DataDeletion";
import Drafts from "./pages/Orders/Drafts";
import Home from "./pages/Home/Home";
import OrderDetails from "./pages/Orders/OrderDetails";

function App() {
  return (
    <Router>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/sign-up" />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/new-order" element={<NewOrder />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/order-details/:orderId" element={<OrderDetails />} />
        <Route path="/drafts" element={<Drafts />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/home" element={<Home />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/writers" element={<Writers />} />
        <Route path="/top-writers" element={<TopWriters />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/news" element={<News />} />
        <Route path="/order-checkout" element={<OrderCheckout />} />
        <Route path="/payment/success" element={<Success />} />
        <Route path="/payment/failed" element={<Failure />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/data-deletion" element={<DataDeletion />} />
      </Routes>
    </Router>
  );
}

export default App;
