import { useForm } from "react-hook-form";
import type { ResidentInput } from "../../types";

interface ResidentFormProps {
  defaultValues?: Partial<ResidentInput>;
  isEdit: boolean;
  unitApartments?: number[]; 
  onSubmit: (data: ResidentInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  serverError?: string;
}

function ResidentForm({
  defaultValues,
  isEdit,
  unitApartments = [],
  onSubmit,
  onCancel,
  isSubmitting,
  serverError,
}: ResidentFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResidentInput>({ defaultValues: { isUnit: false, ...defaultValues } });

  const email = watch("email");
  const phone = watch("phone");
  const canLogin = Boolean(email || phone);
  const passwordRequired = !isEdit && canLogin;

  const hasUnits = unitApartments.length > 0;
  const apartment = watch("apartment");
  const isUnit = watch("isUnit");

  function submit(values: ResidentInput) {
    onSubmit({
      ...values,
      email: values.email || undefined,
      phone: values.phone || undefined,
      password: values.password || undefined,
      isUnit: hasUnits ? Boolean(values.isUnit) : false,
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit(submit)} noValidate>
      <div className="form-row">
        <div className={errors.fullName ? "field field--error" : "field"}>
          <label htmlFor="fullName">שם מלא</label>
          <input id="fullName" {...register("fullName", { required: "יש להזין שם דייר" })} />
          {errors.fullName && <span className="field__error">{errors.fullName.message}</span>}
        </div>

        <div className={errors.apartment ? "field field--error" : "field"}>
          <label htmlFor="apartment">מספר דירה</label>
          <input
            id="apartment"
            type="number"
            {...register("apartment", {
              valueAsNumber: true,
              required: "יש להזין מספר דירה",
              min: { value: 1, message: "מספר דירה לא תקין" },
            })}
          />
          {errors.apartment && <span className="field__error">{errors.apartment.message}</span>}
        </div>
      </div>

      {hasUnits && (
        <div className={errors.isUnit ? "field field--error" : "field"}>
          <label className="checkbox">
            <input
              type="checkbox"
              {...register("isUnit", {
                validate: (checked) =>
                  !checked || unitApartments.includes(apartment) || `לדירה ${apartment || ""} אין יחידת דיור`,
              })}
            />
            הדייר גר ביחידת הדיור {isUnit && apartment ? `(${apartment}א)` : ""}
          </label>
          {errors.isUnit ? (
            <span className="field__error">{errors.isUnit.message}</span>
          ) : (
            <span className="field__hint">
              בבניין יש יחידות דיור בדירות: {unitApartments.join(", ")}
            </span>
          )}
        </div>
      )}

      <div className="form-row">
        <div className={errors.email ? "field field--error" : "field"}>
          <label htmlFor="email">אימייל</label>
          <input
            id="email"
            type="email"
            placeholder="לא חובה"
            {...register("email", {
              pattern: { value: /^\S+@\S+\.\S+$/, message: "כתובת אימייל לא תקינה" },
            })}
          />
          {errors.email && <span className="field__error">{errors.email.message}</span>}
        </div>

        <div className={errors.phone ? "field field--error" : "field"}>
          <label htmlFor="phone">טלפון</label>
          <input
            id="phone"
            type="tel"
            placeholder="לא חובה"
            {...register("phone", {
              pattern: { value: /^[\d\s+-]{9,15}$/, message: "מספר טלפון לא תקין" },
            })}
          />
          {errors.phone && <span className="field__error">{errors.phone.message}</span>}
        </div>
      </div>

      <div className={errors.password ? "field field--error" : "field"}>
        <label htmlFor="password">סיסמה</label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder={
            isEdit ? "השאירו ריק כדי לא לשנות" : canLogin ? "" : "לא צריך - הדייר לא מתחבר למערכת"
          }
          {...register("password", {
            required: passwordRequired ? "יש להזין סיסמה, כדי שהדייר יוכל להתחבר" : false,
            minLength: { value: 6, message: "לפחות 6 תווים" },
          })}
        />
        {errors.password && <span className="field__error">{errors.password.message}</span>}
        {!canLogin && !errors.password && (
          <span className="field__hint">
            בלי אימייל וטלפון הדייר רשום רק לפי שם ודירה, ולא יכול להתחבר לאתר.
          </span>
        )}
      </div>

      {serverError && <div className="alert alert--error">{serverError}</div>}

      <div className="actions">
        <button className="btn btn--primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "שומר..." : "שמירה"}
        </button>
        <button className="btn btn--secondary" type="button" onClick={onCancel}>
          ביטול
        </button>
      </div>
    </form>
  );
}

export default ResidentForm;