import { useForm } from "react-hook-form";
import type { TransactionInput } from "../../types";
import { categoryLabels, paymentMethodLabels, statusLabels } from "../../utils/labels";

interface TransactionFormProps {
  defaultValues?: Partial<TransactionInput>;
  onSubmit: (data: TransactionInput) => void;
  isSubmitting: boolean;
  serverError?: string;
}

const today = new Date().toISOString().slice(0, 10);

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
    <form className="form" onSubmit={handleSubmit(submit)} noValidate>
      <div className="segmented">
        <label>
          <input type="radio" value="income" {...register("type")} /> הכנסה
        </label>
        <label>
          <input type="radio" value="expense" {...register("type")} /> הוצאה
        </label>
      </div>

      <div className="form-row">
        <div className={errors.amount ? "field field--error" : "field"}>
          <label htmlFor="amount">סכום (₪)</label>
          <input
            id="amount"
            type="number"
            {...register("amount", {
              valueAsNumber: true,
              required: "יש להזין סכום",
              min: { value: 1, message: "הסכום חייב להיות חיובי" },
            })}
          />
          {errors.amount && <span className="field__error">{errors.amount.message}</span>}
        </div>

        <div className={errors.date ? "field field--error" : "field"}>
          <label htmlFor="date">תאריך</label>
          <input id="date" type="date" {...register("date", { required: "יש לבחור תאריך" })} />
          {errors.date && <span className="field__error">{errors.date.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="category">קטגוריה</label>
          <select id="category" {...register("category")}>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {type === "income" ? (
          <div className={errors.apartment ? "field field--error" : "field"}>
            <label htmlFor="apartment">מספר דירה</label>
            <input
              id="apartment"
              type="number"
              {...register("apartment", {
                valueAsNumber: true,
                required: "בהכנסה חובה לציין דירה",
                min: { value: 1, message: "מספר דירה לא תקין" },
              })}
            />
            {errors.apartment && <span className="field__error">{errors.apartment.message}</span>}
          </div>
        ) : (
          <div className={errors.supplier ? "field field--error" : "field"}>
            <label htmlFor="supplier">ספק</label>
            <input id="supplier" {...register("supplier", { required: "בהוצאה חובה לציין ספק" })} />
            {errors.supplier && <span className="field__error">{errors.supplier.message}</span>}
          </div>
        )}
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="paymentMethod">אמצעי תשלום</label>
          <select id="paymentMethod" {...register("paymentMethod")}>
            {Object.entries(paymentMethodLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="status">סטטוס</label>
          <select id="status" {...register("status")}>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="description">תיאור</label>
        <textarea
          id="description"
          placeholder="לא חובה"
          {...register("description", { maxLength: { value: 500, message: "עד 500 תווים" } })}
        />
        {errors.description && <span className="field__error">{errors.description.message}</span>}
      </div>

      {serverError && <div className="alert alert--error">{serverError}</div>}

      <div className="actions">
        <button className="btn btn--primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "שומר..." : "שמירה"}
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;