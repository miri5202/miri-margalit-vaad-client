import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { homePath } from "../../utils/paths";
import useTheme from "../../hooks/useTheme";

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
    <nav className="navbar">
      <Link className="navbar__brand" to={homePath(user)}>
        <span className="navbar__logo">🏠</span>
        ועד בית
      </Link>

      <div className="navbar__links">
        {user.role === "admin" && !buildingId && (
          <NavLink to="/buildings" end>הבניינים שלי</NavLink>
        )}

        {user.role === "admin" && buildingId && (
          <>
            <NavLink to="/buildings" end>כל הבניינים</NavLink>
            <NavLink to={base} end>לוח ראשי</NavLink>
            <NavLink to={`${base}/transactions`}>תנועות</NavLink>
            <NavLink to={`${base}/payments`}>מי שילם</NavLink>
            <NavLink to={`${base}/debtors`}>חייבים</NavLink>
            <NavLink to={`${base}/residents`}>דיירים</NavLink>
          </>
        )}

        {user.role === "resident" && (
          <>
            <NavLink to={base} end>לוח ראשי</NavLink>
            <NavLink to={`${base}/my-payments`}>התשלומים שלי</NavLink>
            <NavLink to={`${base}/expenses`}>הוצאות</NavLink>
          </>
        )}
      </div>

      <div className="navbar__user">
        <button
          className="btn btn--sm btn--ghost"
          onClick={toggleTheme}
          title={theme === "dark" ? "מצב בהיר" : "מצב כהה"}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        {user.fullName}
        <button className="btn btn--sm btn--ghost" onClick={handleLogout}>
          יציאה
        </button>
      </div>
    </nav>
  );
}

export default Navbar;