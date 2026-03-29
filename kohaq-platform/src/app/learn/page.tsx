import { CourseGrid } from "@/components/learn/CourseGrid";
import { connectToDatabase } from "@/lib/db/mongoose";
import Course from "@/lib/db/models/Course";
import Link from "next/link";

export default async function LearnPage({
  searchParams,
}: {
  searchParams?: {
    search?: string;
    category?: string;
    level?: string;
    price?: string;
  };
}) {
  const search = searchParams?.search?.trim() ?? "";
  const category = searchParams?.category?.trim() ?? "";
  const level = searchParams?.level?.trim() ?? "";
  const price = searchParams?.price?.trim() ?? "";

  const query: Record<string, unknown> = { isPublished: true };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { shortDesc: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    query.category = category;
  }

  if (level) {
    query.level = level;
  }

  if (price === "free") {
    query.price = 0;
  }

  if (price === "paid") {
    query.price = { $gt: 0 };
  }

  await connectToDatabase();
  const courses = await Course.find(query)
    .sort({ createdAt: -1 })
    .select("title slug shortDesc category level price totalDuration")
    .lean();

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      <p className="font-label text-xs uppercase tracking-[0.15em] text-text-muted">Kohaq Learn</p>
      <h1 className="mt-3 font-heading text-4xl text-primary dark:text-white">Build Job-Ready Skills</h1>
      <p className="mt-3 max-w-2xl text-text-muted">
        Follow structured paths, complete lessons, and earn verifiable certificates as you progress.
      </p>

      <form className="mt-6 grid gap-3 rounded-xl border border-border bg-surface p-4 md:grid-cols-5" action="/learn" method="get">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search courses"
          className="rounded-lg border border-border bg-bg px-3 py-2 text-sm md:col-span-2"
        />
        <input
          type="text"
          name="category"
          defaultValue={category}
          placeholder="Category"
          className="rounded-lg border border-border bg-bg px-3 py-2 text-sm"
        />
        <select name="level" defaultValue={level} className="rounded-lg border border-border bg-bg px-3 py-2 text-sm">
          <option value="">All levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <select name="price" defaultValue={price} className="rounded-lg border border-border bg-bg px-3 py-2 text-sm">
          <option value="">Any price</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>

        <div className="md:col-span-5 flex gap-3">
          <button type="submit" className="rounded-full bg-accent px-5 py-2 font-label text-xs uppercase tracking-[0.15em] text-[#111]">
            Apply filters
          </button>
          <Link href="/learn" className="rounded-full border border-border px-5 py-2 font-label text-xs uppercase tracking-[0.15em] text-text-muted">
            Reset
          </Link>
        </div>
      </form>

      <div className="mt-8">
        <CourseGrid items={courses.map((course) => ({ ...course, _id: course._id.toString() }))} />
      </div>
    </main>
  );
}

