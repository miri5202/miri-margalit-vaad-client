import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/errors";
import { homePath } from "../utils/paths";

interface LoginFormValues {
  login: string;
  password: string;
}

function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  if (user) {
    return <Navigate to={homePath(user)} replace />;
  }

  async function onSubmit(values: LoginFormValues) {
    setServerError("");
    try {
      const loggedInUser = await login(values.login, values.password);
      navigate(homePath(loggedInUser), { replace: true });
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__side">
        <h1>ועד בית, בלי כאב ראש</h1>
        <p>תשלומים, הוצאות וחובות של כל הבניין - במקום אחד, שקוף לכל הדיירים.</p>
      </div>

      <div className="auth-page__main">
        <div className="auth-card">
          <h2>שלום וברכה 👋</h2>
          <p className="auth-card__sub">התחברו כדי לנהל את הבניין</p>

          <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={errors.login ? "field field--error" : "field"}>
              <label htmlFor="login">אימייל או טלפון</label>
              <input
                id="login"
                type="text"
                autoComplete="username"
                {...register("login", { required: "יש להזין אימייל או טלפון" })}
              />
              {errors.login && <span className="field__error">{errors.login.message}</span>}
            </div>

            <div className={errors.password ? "field field--error" : "field"}>
              <label htmlFor="password">סיסמה</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password", { required: "יש להזין סיסמה" })}
              />
              {errors.password && <span className="field__error">{errors.password.message}</span>}
            </div>

            {serverError && <div className="alert alert--error">{serverError}</div>}

            <button className="btn btn--primary btn--block" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "מתחבר..." : "כניסה"}
            </button>
          </form>

          <p className="auth-card__footer">
            ועד חדש? <Link to="/register">להרשמה</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
