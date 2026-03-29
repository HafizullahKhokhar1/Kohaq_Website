import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/db/mongoose";
import Course from "@/lib/db/models/Course";
import Lesson from "@/lib/db/models/Lesson";

export async function GET(_: Request, { params }: { params: { slug: string; lessonId: string } }) {
  try {
    if (!isValidObjectId(params.lessonId)) {
      return NextResponse.json({ success: false, error: "Invalid lesson id" }, { status: 400 });
    }

    await connectToDatabase();

    const course = await Course.findOne({ slug: params.slug, isPublished: true }).select("_id").lean();
    if (!course) {
      return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
    }

    const lesson = await Lesson.findOne({
      _id: params.lessonId,
      course: course._id,
      isPublished: true,
    }).lean();

    if (!lesson) {
      return NextResponse.json({ success: false, error: "Lesson not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: lesson });
  } catch {
    return NextResponse.json({ success: false, error: "Request failed" }, { status: 500 });
  }
}
