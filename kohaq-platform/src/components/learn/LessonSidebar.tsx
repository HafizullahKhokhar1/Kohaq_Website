import Link from "next/link";

type LessonSidebarItem = {
  id: string;
  title: string;
  order: number;
  watchPercentage: number;
  isCompleted: boolean;
};

function LessonStatus({ percentage, completed }: { percentage: number; completed: boolean }) {
  if (completed) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-[#0d1b2a]">
        ✓
      </span>
    );
  }

  if (percentage > 0) {
    return (
      <span
        className="inline-block h-6 w-6 rounded-full border border-border"
        style={{
          background: `conic-gradient(var(--color-accent) ${Math.max(1, Math.min(100, percentage))}%, transparent 0)`,
        }}
      />
    );
  }

  return <span className="inline-block h-6 w-6 rounded-full border border-border bg-surface-2" />;
}

export function LessonSidebar({
  courseSlug,
  activeLessonId,
  lessons,
}: {
  courseSlug: string;
  activeLessonId: string;
  lessons: LessonSidebarItem[];
}) {
  return (
    <aside className="rounded-xl border border-border bg-surface p-4">
      <h2 className="font-heading text-xl text-primary dark:text-white">Lessons</h2>
      <ul className="mt-4 space-y-2">
        {lessons.map((lesson) => {
          const isActive = lesson.id === activeLessonId;

          return (
            <li key={lesson.id}>
              <Link
                href={`/learn/${courseSlug}/lesson/${lesson.id}`}
                className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition ${
                  isActive
                    ? "border-accent bg-surface-2"
                    : "border-transparent hover:border-border hover:bg-surface-2"
                }`}
              >
                <LessonStatus percentage={lesson.watchPercentage} completed={lesson.isCompleted} />
                <div>
                  <p className="text-xs text-text-muted">Lesson {lesson.order + 1}</p>
                  <p className="text-sm text-text">{lesson.title}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

