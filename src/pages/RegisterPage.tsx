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

interface RegisterFormValues {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

function RegisterPage() {
  const { user, register: registerUser } = useAuth();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>();

  if (user) {
    return <Navigate to={homePath(user)} replace />;
  }

  async function onSubmit(values: RegisterFormValues) {
    setServerError("");
    try {
      await registerUser(values.fullName, values.email, values.password, values.phone || undefined);
      navigate("/buildings", { replace: true });
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  }

  return (
    <AuthLayout>
      <form
        className="relative grid max-w-md gap-4 rounded-3xl border-[2.5px] border-ink bg-paper p-5 sm:p-6"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <span className="absolute -top-3 right-10 h-6 w-24 -rotate-[4deg] rounded-sm bg-mint/80" aria-hidden="true" />
        <div>
          <h2 className="text-2xl">הרשמת ועד חדש</h2>
          <p className="text-sm text-muted">פתחו חשבון, ואחר כך תוכלו להוסיף את הבניינים שלכם</p>
        </div>

        <Field label="שם מלא" htmlFor="fullName" error={errors.fullName?.message}>
          <input
            id="fullName"
            autoComplete="name"
            className={input(Boolean(errors.fullName))}
            {...register("fullName", { required: "יש להזין שם מלא" })}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="אימייל" htmlFor="email" error={errors.email?.message}>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={input(Boolean(errors.email))}
              {...register("email", {
                required: "יש להזין אימייל",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "כתובת אימייל לא תקינה" },
              })}
            />
          </Field>

          <Field label="טלפון" htmlFor="phone" error={errors.phone?.message}>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="לא חובה"
              className={input(Boolean(errors.phone))}
              {...register("phone", {
                pattern: { value: /^[\d\s+-]{9,15}$/, message: "מספר טלפון לא תקין" },
              })}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="סיסמה" htmlFor="password" error={errors.password?.message}>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              className={input(Boolean(errors.password))}
              {...register("password", {
                required: "יש להזין סיסמה",
                minLength: { value: 6, message: "לפחות 6 תווים" },
              })}
            />
          </Field>

          <Field label="אימות סיסמה" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className={input(Boolean(errors.confirmPassword))}
              {...register("confirmPassword", {
                required: "יש להזין שוב את הסיסמה",
                validate: (value) => value === watch("password") || "הסיסמאות לא תואמות",
              })}
            />
          </Field>
        </div>

        {serverError && <ErrorMessage message={serverError} />}

        <button className={btn("primary")} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "נרשם..." : "הרשמה ←"}
        </button>

        <p className="text-center text-muted">
          כבר רשומים?{" "}
          <Link to="/login" className="font-bold text-ink underline decoration-sun decoration-4 underline-offset-2">
            להתחברות
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;
