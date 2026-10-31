import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Announcement, AnnouncementInput } from "../../types";
import { createAnnouncement, deleteAnnouncement, updateAnnouncement } from "../../api/announcements";
import { formatDate } from "../../utils/format";
import { getErrorMessage } from "../../utils/errors";
import { btn, cn } from "../../utils/ui";
import AnnouncementForm from "./AnnouncementForm";

interface AnnouncementsBoardProps {
  buildingId: number;
  announcements: Announcement[];
  canEdit: boolean; 
}

const NOTES = ["bg-[#fffdf5] -rotate-2", "bg-[#fff1f0] rotate-[1.5deg]", "bg-[#f0fbf6] -rotate-1"];
const NOTE_BASE = "relative min-w-0 p-3.5 pt-4 text-deep shadow-[2px_3px_0_rgba(35,48,77,0.35)]";

function AnnouncementsBoard({ buildingId, announcements, canEdit }: AnnouncementsBoardProps) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<"new" | number | null>(null);

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["announcements", buildingId] });
  }

  const saveMutation = useMutation({
    mutationFn: (data: AnnouncementInput) =>
      editing === "new" || editing === null
        ? createAnnouncement(buildingId, data)
        : updateAnnouncement(buildingId, editing, data),
    onSuccess: () => {
      refresh();
      setEditing(null);
    },
  });

  const pinMutation = useMutation({
    mutationFn: (a: Announcement) => updateAnnouncement(buildingId, a.id, { pinned: !a.pinned }),
    onSuccess: refresh,
  });

  const deleteMutation = useMutation({
    mutationFn: (a: Announcement) => deleteAnnouncement(buildingId, a.id),
    onSuccess: refresh,
  });

  function handleDelete(a: Announcement) {
    if (window.confirm(`למחוק את ההודעה "${a.title}"?`)) {
      deleteMutation.mutate(a);
    }
  }

  function openForm(target: "new" | number) {
    saveMutation.reset();
    setEditing(target);
  }

  const formProps = {
    onSubmit: (data: AnnouncementInput) => saveMutation.mutate(data),
    onCancel: () => setEditing(null),
    isSubmitting: saveMutation.isPending,
    serverError: saveMutation.error ? getErrorMessage(saveMutation.error) : undefined,
  };

  return (
    <section className="rounded-3xl border-[2.5px] border-ink bg-corkboard px-4 pt-5 pb-5 sm:px-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="inline-block -rotate-1 rounded-xl border-2 border-ink bg-card px-3.5 py-0.5 text-xl">
          לוח המודעות
        </h2>
        {canEdit && editing === null && (
          <button className={btn("primary", "sm")} onClick={() => openForm("new")}>
            + הודעה חדשה
          </button>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {editing === "new" && (
          <div className={cn(NOTE_BASE, "bg-card")}>
            <h3 className="mb-2 text-base">הודעה חדשה</h3>
            <AnnouncementForm {...formProps} />
          </div>
        )}

        {announcements.map((a, i) =>
          editing === a.id ? (
            <div key={a.id} className={cn(NOTE_BASE, "bg-card")}>
              <h3 className="mb-2 text-base">עריכת הודעה</h3>
              <AnnouncementForm
                {...formProps}
                defaultValues={{ title: a.title, body: a.body, pinned: a.pinned }}
              />
            </div>
          ) : (
            <article key={a.id} className={cn(NOTE_BASE, NOTES[i % NOTES.length])}>
              <span className="absolute -top-2.5 right-[30%] h-5 w-16 -rotate-3 bg-sky/70" aria-hidden="true" />
              {a.pinned && (
                <span className="absolute top-1.5 left-2" title="הודעה נעוצה">
                  📌
                </span>
              )}
              <h3 className="mb-1 text-base">{a.title}</h3>
              <p className="text-sm whitespace-pre-line text-deep/80">{a.body}</p>
              <small className="mt-2 block text-xs text-deep/60">
                {a.authorName ?? "הוועד"} · {formatDate(a.createdAt.slice(0, 10))}
              </small>

              {canEdit && (
                <div className="mt-3 flex flex-wrap gap-1.5 border-t border-dashed border-deep/20 pt-2">
                  <button
                    className="cursor-pointer rounded-lg px-2 py-0.5 text-xs font-semibold hover:bg-deep/10"
                    onClick={() => openForm(a.id)}
                  >
                    ✏️ עריכה
                  </button>
                  <button
                    className="cursor-pointer rounded-lg px-2 py-0.5 text-xs font-semibold hover:bg-deep/10"
                    onClick={() => pinMutation.mutate(a)}
                  >
                    {a.pinned ? "ביטול נעיצה" : "📌 נעיצה"}
                  </button>
                  <button
                    className="cursor-pointer rounded-lg px-2 py-0.5 text-xs font-semibold text-late-text hover:bg-late/30"
                    onClick={() => handleDelete(a)}
                  >
                    🗑️ מחיקה
                  </button>
                </div>
              )}
            </article>
          )
        )}
      </div>

      {announcements.length === 0 && editing !== "new" && (
        <p className="font-hand text-deep">
          {canEdit ? 'אין הודעות כרגע. לחצו על "+ הודעה חדשה" כדי לפרסם הודעה לכל דיירי הבניין.' : "אין הודעות כרגע"}
        </p>
      )}
    </section>
  );
}

export default AnnouncementsBoard;
