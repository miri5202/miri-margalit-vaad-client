import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/errors";
import { homePath } from "../utils/paths";
import AuthLayout from "../components/layout/AuthLayout";
import Field from "../components/ui/Field";
import ErrorMessage from "../components/common/ErrorMessage";
import { btn, input } from "../utils/ui";

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
    setValue,
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

  // ממלא את הטופס במשתמש לדוגמה (לבדיקת האתר)
  function fillDemo(login: string) {
    setValue("login", login);
    setValue("password", "123456");
  }

  return (
    <AuthLayout>
      <form
        className="relative grid max-w-md gap-4 rounded-3xl border-[2.5px] border-ink bg-paper p-5 sm:p-6"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {/* נייר דבק */}
        <span className="absolute -top-3 right-10 h-6 w-24 -rotate-[4deg] rounded-sm bg-sun/75" aria-hidden="true" />
        <h2 className="text-2xl">כניסה</h2>

        <Field label="אימייל או טלפון" htmlFor="login" error={errors.login?.message}>
          <input
            id="login"
            type="text"
            autoComplete="username"
            className={input(Boolean(errors.login))}
            {...register("login", { required: "יש להזין אימייל או טלפון" })}
          />
        </Field>

        <Field label="סיסמה" htmlFor="password" error={errors.password?.message}>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className={input(Boolean(errors.password))}
            {...register("password", { required: "יש להזין סיסמה" })}
          />
        </Field>

        {serverError && <ErrorMessage message={serverError} />}

        <button className={btn("primary")} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "מתחבר..." : "כניסה ←"}
        </button>

        <div className="grid gap-2 border-t-2 border-dashed border-line pt-4">
          <span className="font-hand text-coral">✎ רוצים לבדוק את האתר? (סיסמה: 123456)</span>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btn("secondary", "sm")} onClick={() => fillDemo("admin@vaad.test")}>
              כניסה כוועד בית
            </button>
            <button type="button" className={btn("secondary", "sm")} onClick={() => fillDemo("apt2@vaad.test")}>
              כניסה כדייר
            </button>
          </div>
        </div>

        <p className="text-center text-muted">
          ועד חדש?{" "}
          <Link to="/register" className="font-bold text-ink underline decoration-sun decoration-4 underline-offset-2">
            להרשמה
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
