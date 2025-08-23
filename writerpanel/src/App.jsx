import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
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

function App() {
  return (
    <Router>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/sign-up" />} />
        <Route path="/landing" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/profile-completion" element={<ProfileCompletion />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/public-orders" element={<Orders />} />
        <Route path="/my-orders/:status" element={<MyOrders />} />
        <Route path="/order-details/:orderId" element={<OrderDetails />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/news" element={<News />} />
      </Routes>
    </Router>
  );
}

export default App;
