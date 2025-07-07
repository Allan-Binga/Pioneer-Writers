import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { isUserLoggedIn } from "../utils/auth";

function Layout({ children }) {
  const loggedIn = isUserLoggedIn();
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex">
      {loggedIn && (
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      )}
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default Layout;
