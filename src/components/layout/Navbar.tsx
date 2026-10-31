import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { homePath } from "../../utils/paths";
import useTheme from "../../hooks/useTheme";
import Logo from "../ui/Logo";
import { btn, cn } from "../../utils/ui";

function linkClass({ isActive }: { isActive: boolean }) {
  return cn(
    "whitespace-nowrap rounded-full px-3.5 py-1.5 font-medium no-underline transition-colors",
    isActive ? "border-2 border-ink bg-sun text-deep shadow-sketch-sm" : "border-2 border-transparent text-ink hover:bg-soft"
  );
}

function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { buildingId } = useParams();
  const base = `/buildings/${buildingId}`;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-20 border-b-2 border-dashed border-line bg-card/95 backdrop-blur print:hidden">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <Link to={homePath(user)} className="flex items-center gap-2 font-hand text-xl font-extrabold text-ink no-underline">
          <Logo />
          ועד בית
        </Link>

        <div className="order-3 -mx-1 flex w-full gap-1 overflow-x-auto px-1 py-1 md:order-none md:w-auto md:flex-1">
          {user.role === "admin" && !buildingId && (
            <NavLink to="/buildings" end className={linkClass}>
              הבניינים שלי
            </NavLink>
          )}

          {user.role === "admin" && buildingId && (
            <>
              <NavLink to="/buildings" end className={linkClass}>
                כל הבניינים
              </NavLink>
              <NavLink to={base} end className={linkClass}>
                לוח ראשי
              </NavLink>
              <NavLink to={`${base}/transactions`} className={linkClass}>
                תנועות
              </NavLink>
              <NavLink to={`${base}/payments`} className={linkClass}>
                מי שילם
              </NavLink>
              <NavLink to={`${base}/debtors`} className={linkClass}>
                חייבים
              </NavLink>
              <NavLink to={`${base}/residents`} className={linkClass}>
                דיירים
              </NavLink>
            </>
          )}

          {user.role === "resident" && (
            <>
              <NavLink to={base} end className={linkClass}>
                לוח ראשי
              </NavLink>
              <NavLink to={`${base}/my-payments`} className={linkClass}>
                התשלומים שלי
              </NavLink>
              <NavLink to={`${base}/expenses`} className={linkClass}>
                הוצאות
              </NavLink>
            </>
          )}
        </div>

        <div className="ms-auto flex items-center gap-2 text-sm">
          <span className="font-semibold">{user.fullName}</span>
          <button
            className={btn("secondary", "sm")}
            onClick={toggleTheme}
            title={theme === "dark" ? "מצב בהיר" : "מצב כהה"}
            aria-label={theme === "dark" ? "מעבר למצב בהיר" : "מעבר למצב כהה"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button className={btn("secondary", "sm")} onClick={handleLogout}>
            יציאה
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
