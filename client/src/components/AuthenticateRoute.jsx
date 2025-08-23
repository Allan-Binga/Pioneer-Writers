import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Spinner from "./Spinner";
import { fetchProfile } from "../utils/profile";

function AuthenticateRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchProfile();
        setIsAuthenticated(true);
      } catch {
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
  if (!isAuthenticated) return <Navigate to="/sign-in" replace />;

  return children;
}

export default AuthenticateRoute;
