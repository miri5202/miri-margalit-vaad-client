import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/errors";
import { homePath } from "../utils/paths";

interface RegisterFormValues {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

function RegisterPage() {
    const { user, register: registerUser } = useAuth(); const navigate = useNavigate();

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
                        <div className={errors.fullName ? "field field--error" : "field"}>
                            <label htmlFor="fullName">שם מלא</label>
                            <input id="fullName" {...register("fullName", { required: "יש להזין שם מלא" })} />
                            {errors.fullName && <span className="field__error">{errors.fullName.message}</span>}
                        </div>

                        <div className={errors.email ? "field field--error" : "field"}>
                            <label htmlFor="email">אימייל</label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                {...register("email", {
                                    required: "יש להזין אימייל",
                                    pattern: { value: /^\S+@\S+\.\S+$/, message: "כתובת אימייל לא תקינה" },
                                })}
                            />
                            {errors.email && <span className="field__error">{errors.email.message}</span>}
                        </div>

                        <div className="field">
                            <label htmlFor="phone">טלפון</label>
                            <input id="phone" type="tel" placeholder="לא חובה" {...register("phone")} />
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

                        <div className={errors.confirmPassword ? "field field--error" : "field"}>
                            <label htmlFor="confirmPassword">אימות סיסמה</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                {...register("confirmPassword", {
                                    required: "יש להזין שוב את הסיסמה",
                                    validate: (value) => value === watch("password") || "הסיסמאות לא תואמות",
                                })}
                            />
                            {errors.confirmPassword && <span className="field__error">{errors.confirmPassword.message}</span>}
                        </div>

                        {serverError && <div className="alert alert--error">{serverError}</div>}

                        <button className="btn btn--primary btn--block" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "מתחבר..." : "כניסה"}
                        </button>
                    </form>

                    <p className="auth-card__footer">
                        כבר רשומים? <Link to="/register">להתחברות</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
