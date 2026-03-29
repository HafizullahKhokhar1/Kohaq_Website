import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { connectToDatabase } from "@/lib/db/mongoose";
import Course from "@/lib/db/models/Course";
import Enrollment from "@/lib/db/models/Enrollment";

export async function POST(_: Request, { params }: { params: { slug: string } }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const course = await Course.findOne({ slug: params.slug, isPublished: true });
    if (!course) {
      return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
    }

    const existing = await Enrollment.findOne({ user: session.user.id, course: course._id }).lean();
    if (existing) {
      return NextResponse.json({ success: true, data: existing });
    }

    const enrollment = await Enrollment.create({
      user: session.user.id,
      course: course._id,
      overallProgress: 0,
      certificateIssued: false,
    });

    await Course.updateOne({ _id: course._id }, { $inc: { enrollmentCount: 1 } });

    return NextResponse.json({ success: true, data: enrollment }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Request failed" }, { status: 500 });
  }
}
