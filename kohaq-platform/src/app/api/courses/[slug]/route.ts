import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import Course from "@/lib/db/models/Course";
import Lesson from "@/lib/db/models/Lesson";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    await connectToDatabase();

    const course = await Course.findOne({ slug: params.slug, isPublished: true }).lean();

    if (!course) {
      return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
    }

    const lessons = await Lesson.find({ course: course._id, isPublished: true })
      .sort({ order: 1, createdAt: 1 })
      .select("title description youtubeVideoId duration order hasQuiz")
      .lean();

    return NextResponse.json({ success: true, data: { ...course, lessons } });
  } catch {
    return NextResponse.json({ success: false, error: "Request failed" }, { status: 500 });
  }
}
