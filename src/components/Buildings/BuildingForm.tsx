import { useForm } from "react-hook-form";
import type { BuildingInput } from "../../types";
import Field from "../ui/Field";
import ErrorMessage from "../common/ErrorMessage";
import { btn, input } from "../../utils/ui";

interface BuildingFormProps {
  onSubmit: (data: BuildingInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  serverError?: string;
}

// טופס הוספת בניין (כולל יחידות דיור - לא חובה)
function BuildingForm({ onSubmit, onCancel, isSubmitting, serverError }: BuildingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BuildingInput>({
    defaultValues: { monthlyFee: 100, dueDay: 10, unitFee: 0, unitApartments: "" },
  });

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="שם הבניין" htmlFor="name" error={errors.name?.message}>
          <input id="name" className={input(Boolean(errors.name))} {...register("name", { required: "יש להזין שם לבניין" })} />
        </Field>

        <Field label="כתובת" htmlFor="address" error={errors.address?.message}>
          <input id="address" className={input(Boolean(errors.address))} {...register("address", { required: "יש להזין כתובת" })} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="עיר" htmlFor="city" error={errors.city?.message}>
          <input id="city" className={input(Boolean(errors.city))} {...register("city", { required: "יש להזין עיר" })} />
        </Field>

        <Field label="מספר דירות" htmlFor="apartmentsCount" error={errors.apartmentsCount?.message}>
          <input
            id="apartmentsCount"
            type="number"
            className={input(Boolean(errors.apartmentsCount))}
            {...register("apartmentsCount", {
              valueAsNumber: true,
              required: "יש להזין מספר דירות",
              min: { value: 1, message: "בין 1 ל-500 דירות" },
              max: { value: 500, message: "בין 1 ל-500 דירות" },
            })}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="דמי ועד חודשיים (₪)" htmlFor="monthlyFee" error={errors.monthlyFee?.message}>
          <input
            id="monthlyFee"
            type="number"
            className={input(Boolean(errors.monthlyFee))}
            {...register("monthlyFee", {
              valueAsNumber: true,
              required: "יש להזין סכום",
              min: { value: 0, message: "סכום לא תקין" },
            })}
          />
        </Field>

        <Field label="יום תשלום בחודש" htmlFor="dueDay" error={errors.dueDay?.message}>
          <input
            id="dueDay"
            type="number"
            className={input(Boolean(errors.dueDay))}
            {...register("dueDay", {
              valueAsNumber: true,
              required: "יש להזין יום",
              min: { value: 1, message: "יום בין 1 ל-28" },
              max: { value: 28, message: "יום בין 1 ל-28" },
            })}
          />
        </Field>
      </div>

      <fieldset className="grid gap-4 rounded-2xl border-2 border-dashed border-line p-4 sm:grid-cols-2">
        <legend className="px-2 font-hand font-semibold">יחידות דיור (לא חובה)</legend>
        <Field
          label="דירות עם יחידת דיור"
          htmlFor="unitApartments"
          error={errors.unitApartments?.message}
          hint='מספרי הדירות, מופרדים בפסיק. למשל "3, 5"'
        >
          <input
            id="unitApartments"
            placeholder="3, 5"
            className={input(Boolean(errors.unitApartments))}
            {...register("unitApartments", {
              pattern: { value: /^[\d\s,]*$/, message: "רק מספרים ופסיקים" },
            })}
          />
        </Field>

        <Field label="דמי ועד ליחידה (₪)" htmlFor="unitFee" error={errors.unitFee?.message}>
          <input
            id="unitFee"
            type="number"
            className={input(Boolean(errors.unitFee))}
            {...register("unitFee", {
              valueAsNumber: true,
              min: { value: 0, message: "סכום לא תקין" },
            })}
          />
        </Field>
      </fieldset>

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

export default BuildingForm;
