import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 pt-7 pb-16 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
