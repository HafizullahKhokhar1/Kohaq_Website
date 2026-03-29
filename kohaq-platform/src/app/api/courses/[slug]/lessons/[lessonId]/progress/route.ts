import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { nanoid } from "nanoid";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { connectToDatabase } from "@/lib/db/mongoose";
import Course from "@/lib/db/models/Course";
import Lesson from "@/lib/db/models/Lesson";
import Progress from "@/lib/db/models/Progress";
import Enrollment from "@/lib/db/models/Enrollment";
import Certificate from "@/lib/db/models/Certificate";

const payloadSchema = z.object({
  watchedSeconds: z.number().min(0),
});

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string; lessonId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!isValidObjectId(params.lessonId)) {
      return NextResponse.json({ success: false, error: "Invalid lesson id" }, { status: 400 });
    }

    const body = await request.json();
    const parsed = payloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    await connectToDatabase();

    const course = await Course.findOne({ slug: params.slug, isPublished: true }).select("_id title");
    if (!course) {
      return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
    }

    const lesson = await Lesson.findOne({
      _id: params.lessonId,
      course: course._id,
      isPublished: true,
    })
      .select("_id duration")
      .lean();

    if (!lesson) {
      return NextResponse.json({ success: false, error: "Lesson not found" }, { status: 404 });
    }

    const totalSeconds = Math.max(1, lesson.duration ?? 1);

    const progress = await Progress.findOne({
      user: session.user.id,
      course: course._id,
      lesson: lesson._id,
    });

    const nextWatchedSeconds = Math.min(totalSeconds, Math.max(progress?.watchedSeconds ?? 0, parsed.data.watchedSeconds));

    let updated = progress;

    if (!updated) {
      updated = await Progress.create({
        user: session.user.id,
        course: course._id,
        lesson: lesson._id,
        watchedSeconds: nextWatchedSeconds,
        totalSeconds,
        lastWatchedAt: new Date(),
      });
    } else {
      updated.watchedSeconds = nextWatchedSeconds;
      updated.totalSeconds = totalSeconds;
      updated.lastWatchedAt = new Date();
      await updated.save();
    }

    const enrollment = await Enrollment.findOne({ user: session.user.id, course: course._id });

    if (!enrollment) {
      return NextResponse.json({ success: false, error: "User is not enrolled in this course" }, { status: 403 });
    }

    const [allLessons, completedCount] = await Promise.all([
      Lesson.countDocuments({ course: course._id, isPublished: true }),
      Progress.countDocuments({ user: session.user.id, course: course._id, isCompleted: true }),
    ]);

    const overallProgress = allLessons > 0 ? Math.round((completedCount / allLessons) * 100) : 0;

    enrollment.overallProgress = overallProgress;

    if (overallProgress >= 100 && !enrollment.completedAt) {
      enrollment.completedAt = new Date();
    }

    let issuedCertificateId: string | null = null;

    if (overallProgress >= 100 && !enrollment.certificateIssued) {
      const year = new Date().getFullYear();
      const certificateId = `KOHAQ-${year}-${nanoid(8)}`;
      const verificationUrl = `/learn/${params.slug}/certificate/${certificateId}`;

      await Certificate.create({
        user: session.user.id,
        course: course._id,
        enrollment: enrollment._id,
        certificateId,
        verificationUrl,
      });

      enrollment.certificateIssued = true;
      enrollment.certificateId = certificateId;
      issuedCertificateId = certificateId;
    }

    await enrollment.save();

    return NextResponse.json({
      success: true,
      data: {
        progress: {
          watchedSeconds: updated.watchedSeconds,
          totalSeconds: updated.totalSeconds,
          watchPercentage: updated.watchPercentage,
          isCompleted: updated.isCompleted,
          completedAt: updated.completedAt,
          lastWatchedAt: updated.lastWatchedAt,
        },
        enrollment: {
          overallProgress,
          certificateIssued: enrollment.certificateIssued,
          certificateId: issuedCertificateId ?? enrollment.certificateId ?? null,
        },
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Request failed" }, { status: 500 });
  }
}
