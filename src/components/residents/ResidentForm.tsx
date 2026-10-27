import { useForm } from "react-hook-form";
import type { ResidentInput } from "../../types";

interface ResidentFormProps {
  defaultValues?: Partial<ResidentInput>; 
  isEdit: boolean;                       
  onSubmit: (data: ResidentInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  serverError?: string;
}

function ResidentForm({ defaultValues, isEdit, onSubmit, onCancel, isSubmitting, serverError }: ResidentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResidentInput>({ defaultValues });

  function submit(values: ResidentInput) {
    onSubmit({
      ...values,
      password: values.password || undefined,
      phone: values.phone || undefined,
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

        <div className={errors.email ? "field field--error" : "field"}>
          <label htmlFor="email">אימייל</label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "יש להזין כתובת אימייל",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "כתובת אימייל לא תקינה" },
            })}
          />
          {errors.email && <span className="field__error">{errors.email.message}</span>}
        </div>
      </div>

      <div className="form-row">
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

        <div className="field">
          <label htmlFor="phone">טלפון</label>
          <input id="phone" type="tel" placeholder="לא חובה" {...register("phone")} />
        </div>
      </div>

      <div className={errors.password ? "field field--error" : "field"}>
        <label htmlFor="password">סיסמה</label>
        <input
          id="password"
          type="password"
          placeholder={isEdit ? "השאירו ריק כדי לא לשנות" : ""}
          {...register("password", {
            required: isEdit ? false : "יש להזין סיסמה",
            minLength: { value: 6, message: "לפחות 6 תווים" },
          })}
        />
        {errors.password && <span className="field__error">{errors.password.message}</span>}
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
