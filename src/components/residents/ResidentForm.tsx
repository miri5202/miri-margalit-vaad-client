import { useForm } from "react-hook-form";
import type { ResidentInput } from "../../types";
import Field from "../ui/Field";
import ErrorMessage from "../common/ErrorMessage";
import { btn, input } from "../../utils/ui";

interface ResidentFormProps {
  defaultValues?: Partial<ResidentInput>;
  isEdit: boolean;
  unitApartments?: number[]; // לאילו דירות בבניין יש יחידת דיור
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

  // סיסמה חובה רק לדייר חדש שיש לו אימייל או טלפון (כלומר, שיוכל להתחבר)
  const email = watch("email");
  const phone = watch("phone");
  const canLogin = Boolean(email || phone);
  const passwordRequired = !isEdit && canLogin;

  // יחידת דיור: האפשרות מופיעה רק אם בבניין יש יחידות
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
    <form className="grid gap-4" onSubmit={handleSubmit(submit)} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="שם מלא" htmlFor="fullName" error={errors.fullName?.message}>
          <input id="fullName" className={input(Boolean(errors.fullName))} {...register("fullName", { required: "יש להזין שם דייר" })} />
        </Field>

        <Field label="מספר דירה" htmlFor="apartment" error={errors.apartment?.message}>
          <input
            id="apartment"
            type="number"
            className={input(Boolean(errors.apartment))}
            {...register("apartment", {
              valueAsNumber: true,
              required: "יש להזין מספר דירה",
              min: { value: 1, message: "מספר דירה לא תקין" },
            })}
          />
        </Field>
      </div>

      {hasUnits && (
        <div className="flex flex-col gap-1.5 rounded-2xl border-2 border-dashed border-line p-3">
          <label className="inline-flex cursor-pointer items-center gap-2 font-semibold">
            <input
              type="checkbox"
              className="size-5 accent-coral"
              {...register("isUnit", {
                validate: (checked) =>
                  !checked || unitApartments.includes(apartment) || `לדירה ${apartment || ""} אין יחידת דיור`,
              })}
            />
            הדייר גר ביחידת הדיור {isUnit && apartment ? `(${apartment}א)` : ""}
          </label>
          {errors.isUnit ? (
            <span className="text-sm font-medium text-late-text dark:text-late">{errors.isUnit.message}</span>
          ) : (
            <span className="text-sm text-muted">בבניין יש יחידות דיור בדירות: {unitApartments.join(", ")}</span>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="אימייל" htmlFor="email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            placeholder="לא חובה"
            className={input(Boolean(errors.email))}
            {...register("email", {
              pattern: { value: /^\S+@\S+\.\S+$/, message: "כתובת אימייל לא תקינה" },
            })}
          />
        </Field>

        <Field label="טלפון" htmlFor="phone" error={errors.phone?.message}>
          <input
            id="phone"
            type="tel"
            placeholder="לא חובה"
            className={input(Boolean(errors.phone))}
            {...register("phone", {
              pattern: { value: /^[\d\s+-]{9,15}$/, message: "מספר טלפון לא תקין" },
            })}
          />
        </Field>
      </div>

      <Field
        label="סיסמה"
        htmlFor="password"
        error={errors.password?.message}
        hint={!canLogin ? "בלי אימייל וטלפון הדייר רשום רק לפי שם ודירה, ולא יכול להתחבר לאתר." : undefined}
      >
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className={input(Boolean(errors.password))}
          placeholder={isEdit ? "השאירו ריק כדי לא לשנות" : canLogin ? "" : "לא צריך - הדייר לא מתחבר למערכת"}
          {...register("password", {
            required: passwordRequired ? "יש להזין סיסמה, כדי שהדייר יוכל להתחבר" : false,
            minLength: { value: 6, message: "לפחות 6 תווים" },
          })}
        />
      </Field>

      {serverError && <ErrorMessage message={serverError} />}

      <div className="flex flex-wrap gap-3">
        <button className={btn("primary")} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "שומר..." : "שמירה"}
        </button>
        <button className={btn("secondary")} type="button" onClick={onCancel}>
          ביטול
        </button>
      </div>
    </form>
  );
}

export default ResidentForm;
