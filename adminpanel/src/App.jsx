import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import SignUp from "./pages/SignUp/SignUp";
import SignIn from "./pages/SignIn/SignIn";
import Orders from "./pages/Orders/Orders";
import EmailCenter from "./pages/EmailCenter/EmailCenter";
import News from "./pages/News/News";
import Profile from "./pages/Profile/Profile";
import Dashboard from "./pages/Dashboard/Dashboard";
import Clients from "./pages/Users/Clients";
import UserDetails from "./pages/Users/UserDetails";
import Writers from "./pages/Users/Writers";
import Administrators from "./pages/Users/Admins";
import Settings from "./pages/Settings/Settings";
import OrderDetails from "./pages/Orders/OrderDetails";
import Disputes from "./pages/Disputes/Disputes";

function App() {
  return (
    <Router>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/sign-in" />} />I
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order-details/:orderId" element={<OrderDetails />} />
        <Route path="/email-center" element={<EmailCenter />} />
        <Route path="/news" element={<News />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/writers" element={<Writers />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/clients/:clientId" element={<UserDetails />} />
        <Route path="/administrators" element={<Administrators />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/disputes" element={<Orders />} />
      </Routes>
    </Router>
  );
}

export default App;
