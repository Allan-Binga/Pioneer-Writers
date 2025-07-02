import Sidebar from "../components/Sidebar";
import { isUserLoggedIn } from "../utils/auth";

function Layout({ children }) {
  const loggedIn = isUserLoggedIn();

  return (
    <div className="flex">
      {loggedIn && <Sidebar />}
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default Layout
