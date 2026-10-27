import { useForm } from "react-hook-form";
import type { BuildingInput } from "../../types";

interface BuildingFormProps {
  onSubmit: (data: BuildingInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  serverError?: string;
}

function BuildingForm({ onSubmit, onCancel, isSubmitting, serverError }: BuildingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BuildingInput>({
    defaultValues: { monthlyFee: 100, dueDay: 10 },
  });

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-row">
        <div className={errors.name ? "field field--error" : "field"}>
          <label htmlFor="name">שם הבניין</label>
          <input id="name" {...register("name", { required: "יש להזין שם לבניין" })} />
          {errors.name && <span className="field__error">{errors.name.message}</span>}
        </div>

        <div className={errors.address ? "field field--error" : "field"}>
          <label htmlFor="address">כתובת</label>
          <input id="address" {...register("address", { required: "יש להזין כתובת" })} />
          {errors.address && <span className="field__error">{errors.address.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className={errors.city ? "field field--error" : "field"}>
          <label htmlFor="city">עיר</label>
          <input id="city" {...register("city", { required: "יש להזין עיר" })} />
          {errors.city && <span className="field__error">{errors.city.message}</span>}
        </div>

        <div className={errors.apartmentsCount ? "field field--error" : "field"}>
          <label htmlFor="apartmentsCount">מספר דירות</label>
          <input
            id="apartmentsCount"
            type="number"
            {...register("apartmentsCount", {
              valueAsNumber: true,
              required: "יש להזין מספר דירות",
              min: { value: 1, message: "בין 1 ל-500 דירות" },
              max: { value: 500, message: "בין 1 ל-500 דירות" },
            })}
          />
          {errors.apartmentsCount && <span className="field__error">{errors.apartmentsCount.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className={errors.monthlyFee ? "field field--error" : "field"}>
          <label htmlFor="monthlyFee">דמי ועד חודשיים (₪)</label>
          <input
            id="monthlyFee"
            type="number"
            {...register("monthlyFee", {
              valueAsNumber: true,
              required: "יש להזין סכום",
              min: { value: 0, message: "סכום לא תקין" },
            })}
          />
          {errors.monthlyFee && <span className="field__error">{errors.monthlyFee.message}</span>}
        </div>

        <div className={errors.dueDay ? "field field--error" : "field"}>
          <label htmlFor="dueDay">יום תשלום בחודש</label>
          <input
            id="dueDay"
            type="number"
            {...register("dueDay", {
              valueAsNumber: true,
              required: "יש להזין יום",
              min: { value: 1, message: "יום בין 1 ל-28" },
              max: { value: 28, message: "יום בין 1 ל-28" },
            })}
          />
          {errors.dueDay && <span className="field__error">{errors.dueDay.message}</span>}
        </div>
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

export default BuildingForm;