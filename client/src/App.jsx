import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import NewOrder from "./pages/NewOrder/NewOrder";
import Landing from "./pages/LandingPage/Landing";
import SignUp from "./pages/SignUp/SignUp";
import SignIn from "./pages/SignIn/SignIn";
import OrderPayment from "./pages/OrderPayment/OrderPayment";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/sign-in" />} />
        <Route path="/home" element={<Landing/>}/>
        <Route path="/new-order" element={<NewOrder />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
         <Route path="/order-payment" element={<OrderPayment />} />
      </Routes>
    </Router>
  );
}

export default App;
