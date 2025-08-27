import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "./Spinner";
import { fetchProfile } from "../utils/profile";

function AuthenticateRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchProfile();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spinner />
      </div>
    );
  }
  if (!isAuthenticated) {
    // Save the attempted path in state
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  return children;
}

export default AuthenticateRoute;
