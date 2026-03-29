import Link from "next/link";
import { EnrollButton } from "@/components/learn/EnrollButton";
import { connectToDatabase } from "@/lib/db/mongoose";
import Course from "@/lib/db/models/Course";
import Lesson from "@/lib/db/models/Lesson";

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  await connectToDatabase();

  const course = await Course.findOne({ slug: params.slug, isPublished: true }).lean();

  if (!course) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="font-heading text-3xl text-primary">Course not found</h1>
      </main>
    );
  }

  const lessons = await Lesson.find({ course: course._id, isPublished: true })
    .sort({ order: 1, createdAt: 1 })
    .select("_id title description duration order")
    .lean();

  const firstLesson = lessons[0];

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      <p className="font-label text-xs uppercase tracking-[0.15em] text-text-muted">{course.category ?? "Kohaq Learn"}</p>
      <h1 className="mt-3 max-w-4xl font-heading text-4xl text-primary dark:text-white">{course.title}</h1>
      <p className="mt-4 max-w-3xl text-text-muted">{course.description ?? course.shortDesc}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-text-muted">
        <span className="rounded-full border border-border px-3 py-1">{course.level ?? "all levels"}</span>
        <span className="rounded-full border border-border px-3 py-1">{course.totalDuration ?? 0} min</span>
        <span className="rounded-full border border-border px-3 py-1">{(course.price ?? 0) > 0 ? `PKR ${course.price}` : "Free"}</span>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {firstLesson ? (
          <Link
            href={`/learn/${params.slug}/lesson/${firstLesson._id.toString()}`}
            className="rounded-full border border-primary px-5 py-2 font-label text-xs uppercase tracking-[0.15em] text-primary dark:border-secondary dark:text-secondary"
          >
            Start first lesson
          </Link>
        ) : null}
        <EnrollButton slug={params.slug} />
      </div>

      <section className="mt-10 rounded-xl border border-border bg-surface p-5">
        <h2 className="font-heading text-2xl text-primary dark:text-white">Curriculum</h2>
        <ul className="mt-4 space-y-3">
          {lessons.map((lesson) => (
            <li key={lesson._id.toString()} className="rounded-lg border border-border bg-surface-2 p-4">
              <p className="text-xs text-text-muted">Lesson {lesson.order + 1}</p>
              <p className="mt-1 text-sm text-text">{lesson.title}</p>
              <p className="mt-1 text-xs text-text-muted">{Math.max(1, Math.round((lesson.duration ?? 0) / 60))} min</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
