import type { Announcement } from "../../types";
import { formatDate } from "../../utils/format";
import { cn } from "../../utils/ui";

interface AnnouncementsBoardProps {
  announcements: Announcement[];
}

// כל פתק בצבע וזווית קצת אחרים, כמו בלוח מודעות אמיתי
const NOTES = ["bg-[#fffdf5] -rotate-2", "bg-[#fff1f0] rotate-[1.5deg]", "bg-[#f0fbf6] -rotate-1"];

// לוח המודעות של הבניין: לוח שעם עם פתקים תלויים בנייר דבק
function AnnouncementsBoard({ announcements }: AnnouncementsBoardProps) {
  return (
    <section className="rounded-3xl border-[2.5px] border-ink bg-corkboard px-4 pt-5 pb-5 sm:px-5">
      <h2 className="mb-4 inline-block -rotate-1 rounded-xl border-2 border-ink bg-card px-3.5 py-0.5 text-xl">
        לוח המודעות
      </h2>

      {announcements.length === 0 ? (
        <p className="font-hand text-deep">אין הודעות כרגע</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {announcements.map((a, i) => (
            <article
              key={a.id}
              className={cn(
                "relative min-w-0 p-3.5 pt-4 text-deep shadow-[2px_3px_0_rgba(35,48,77,0.35)]",
                NOTES[i % NOTES.length]
              )}
            >
              {/* נייר דבק */}
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
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AnnouncementsBoard;
