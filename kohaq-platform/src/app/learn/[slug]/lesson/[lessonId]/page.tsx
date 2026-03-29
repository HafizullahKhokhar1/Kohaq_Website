import { auth } from "@/lib/auth/auth";
import { connectToDatabase } from "@/lib/db/mongoose";
import Course from "@/lib/db/models/Course";
import Lesson from "@/lib/db/models/Lesson";
import Progress from "@/lib/db/models/Progress";
import { VideoPlayer } from "@/components/learn/VideoPlayer";
import { LessonSidebar } from "@/components/learn/LessonSidebar";
import { ProgressBar } from "@/components/learn/ProgressBar";

export default async function LessonPlayerPage({
  params,
}: {
  params: { slug: string; lessonId: string };
}) {
  const session = await auth();
  await connectToDatabase();

  const course = await Course.findOne({ slug: params.slug, isPublished: true }).select("_id title").lean();
  if (!course) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="font-heading text-3xl text-primary">Course not found</h1>
      </main>
    );
  }

  const lessons = await Lesson.find({ course: course._id, isPublished: true })
    .sort({ order: 1, createdAt: 1 })
    .select("_id title youtubeVideoId duration order")
    .lean();

  const activeLesson = lessons.find((item) => item._id.toString() === params.lessonId) ?? lessons[0];

  if (!activeLesson) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="font-heading text-3xl text-primary">No published lessons</h1>
      </main>
    );
  }

  const lessonIds = lessons.map((item) => item._id);

  const progressDocs = session?.user?.id
    ? await Progress.find({
        user: session.user.id,
        course: course._id,
        lesson: { $in: lessonIds },
      })
        .select("lesson watchedSeconds watchPercentage isCompleted")
        .lean()
    : [];

  const progressMap = new Map(
    progressDocs.map((item) => [item.lesson.toString(), {
      watchedSeconds: item.watchedSeconds ?? 0,
      watchPercentage: item.watchPercentage ?? 0,
      isCompleted: Boolean(item.isCompleted),
    }])
  );

  const completedCount = progressDocs.filter((item) => item.isCompleted).length;
  const courseProgress = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  const activeProgress = progressMap.get(activeLesson._id.toString());

  return (
    <main className="mx-auto max-w-7xl px-6 py-8 sm:py-10">
      <h1 className="font-heading text-3xl text-primary dark:text-white">{course.title}</h1>
      <div className="mt-4 max-w-lg">
        <ProgressBar value={courseProgress} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[320px,1fr]">
        <LessonSidebar
          courseSlug={params.slug}
          activeLessonId={activeLesson._id.toString()}
          lessons={lessons.map((item) => {
            const progress = progressMap.get(item._id.toString());
            return {
              id: item._id.toString(),
              title: item.title,
              order: item.order ?? 0,
              watchPercentage: progress?.watchPercentage ?? 0,
              isCompleted: progress?.isCompleted ?? false,
            };
          })}
        />

        <section className="space-y-4">
          <h2 className="font-heading text-2xl text-primary dark:text-white">{activeLesson.title}</h2>
          <VideoPlayer
            courseSlug={params.slug}
            lessonId={activeLesson._id.toString()}
            youtubeVideoId={activeLesson.youtubeVideoId}
            initialWatchedSeconds={activeProgress?.watchedSeconds ?? 0}
            initialTotalSeconds={activeLesson.duration ?? 1}
          />
        </section>
      </div>
    </main>
  );
}
