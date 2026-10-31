import { useForm } from "react-hook-form";
import type { AnnouncementInput } from "../../types";
import Field from "../ui/Field";
import ErrorMessage from "./ErrorMessage";
import { btn, input } from "../../utils/ui";

interface AnnouncementFormProps {
  defaultValues?: Partial<AnnouncementInput>;
  onSubmit: (data: AnnouncementInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  serverError?: string;
}

function AnnouncementForm({ defaultValues, onSubmit, onCancel, isSubmitting, serverError }: AnnouncementFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnnouncementInput>({ defaultValues: { pinned: false, ...defaultValues } });

  return (
    <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Field label="כותרת" htmlFor="ann-title" error={errors.title?.message}>
        <input
          id="ann-title"
          className={input(Boolean(errors.title))}
          {...register("title", {
            required: "יש להזין כותרת",
            maxLength: { value: 120, message: "עד 120 תווים" },
          })}
        />
      </Field>

      <Field label="תוכן ההודעה" htmlFor="ann-body" error={errors.body?.message}>
        <textarea
          id="ann-body"
          className={`${input(Boolean(errors.body))} min-h-24 resize-y`}
          {...register("body", {
            required: "יש להזין את תוכן ההודעה",
            maxLength: { value: 2000, message: "עד 2000 תווים" },
          })}
        />
      </Field>

      <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold">
        <input type="checkbox" className="size-5 accent-coral" {...register("pinned")} />
        📌 הודעה נעוצה (תופיע ראשונה)
      </label>

      {serverError && <ErrorMessage message={serverError} />}

      <div className="flex flex-wrap gap-2">
        <button className={btn("primary", "sm")} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "שומר..." : "פרסום"}
        </button>
        <button className={btn("secondary", "sm")} type="button" onClick={onCancel}>
          ביטול
        </button>
      </div>
    </form>
  );
}

export default AnnouncementForm;
