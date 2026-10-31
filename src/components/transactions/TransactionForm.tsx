import { useForm } from "react-hook-form";
import type { TransactionInput } from "../../types";
import { categoryLabels, paymentMethodLabels, statusLabels } from "../../utils/labels";
import Field from "../ui/Field";
import ErrorMessage from "../common/ErrorMessage";
import { btn, input } from "../../utils/ui";

interface TransactionFormProps {
  defaultValues?: Partial<TransactionInput>;
  onSubmit: (data: TransactionInput) => void;
  isSubmitting: boolean;
  serverError?: string;
}

const today = new Date().toISOString().slice(0, 10);

const typeOption =
  "flex-1 cursor-pointer rounded-xl px-4 py-2 text-center font-bold transition-colors has-checked:bg-sun has-checked:text-deep has-checked:shadow-sketch-sm";

function TransactionForm({ defaultValues, onSubmit, isSubmitting, serverError }: TransactionFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TransactionInput>({
    defaultValues: {
      type: "income",
      date: today,
      category: "monthly_fee",
      paymentMethod: "transfer",
      status: "paid",
      ...defaultValues,
    },
  });

  const type = watch("type");

  function submit(values: TransactionInput) {
    onSubmit({
      ...values,
      apartment: values.type === "income" ? values.apartment : null,
      supplier: values.type === "expense" ? values.supplier : null,
      description: values.description || null,
    });
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(submit)} noValidate>
      <div className="flex max-w-xs gap-1 rounded-2xl border-2 border-ink bg-paper p-1">
        <label className={typeOption}>
          <input type="radio" value="income" className="sr-only" {...register("type")} /> ↓ הכנסה
        </label>
        <label className={typeOption}>
          <input type="radio" value="expense" className="sr-only" {...register("type")} /> ↑ הוצאה
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="סכום (₪)" htmlFor="amount" error={errors.amount?.message}>
          <input
            id="amount"
            type="number"
            className={input(Boolean(errors.amount))}
            {...register("amount", {
              valueAsNumber: true,
              required: "יש להזין סכום",
              min: { value: 1, message: "הסכום חייב להיות חיובי" },
            })}
          />
        </Field>

        <Field label="תאריך" htmlFor="date" error={errors.date?.message}>
          <input id="date" type="date" className={input(Boolean(errors.date))} {...register("date", { required: "יש לבחור תאריך" })} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="קטגוריה" htmlFor="category">
          <select id="category" className={input()} {...register("category")}>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>

        {type === "income" ? (
          <Field label="מספר דירה" htmlFor="apartment" error={errors.apartment?.message}>
            <input
              id="apartment"
              type="number"
              className={input(Boolean(errors.apartment))}
              {...register("apartment", {
                valueAsNumber: true,
                required: "בהכנסה חובה לציין דירה",
                min: { value: 1, message: "מספר דירה לא תקין" },
              })}
            />
          </Field>
        ) : (
          <Field label="ספק" htmlFor="supplier" error={errors.supplier?.message}>
            <input
              id="supplier"
              className={input(Boolean(errors.supplier))}
              {...register("supplier", { required: "בהוצאה חובה לציין ספק" })}
            />
          </Field>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="אמצעי תשלום" htmlFor="paymentMethod">
          <select id="paymentMethod" className={input()} {...register("paymentMethod")}>
            {Object.entries(paymentMethodLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="סטטוס" htmlFor="status">
          <select id="status" className={input()} {...register("status")}>
            {Object.entries(statusLabels)
              .filter(([value]) => value !== "partial" || defaultValues?.status === "partial")
              .map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
          </select>
        </Field>
      </div>

      <Field label="תיאור" htmlFor="description" error={errors.description?.message}>
        <textarea
          id="description"
          placeholder="לא חובה"
          className={`${input(Boolean(errors.description))} min-h-24 resize-y`}
          {...register("description", { maxLength: { value: 500, message: "עד 500 תווים" } })}
        />
      </Field>

      {serverError && <ErrorMessage message={serverError} />}

      <div>
        <button className={btn("primary")} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "שומר..." : "שמירה"}
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;
