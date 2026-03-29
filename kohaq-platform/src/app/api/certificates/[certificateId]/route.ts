import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import Certificate from "@/lib/db/models/Certificate";

interface UserDoc {
  name?: string;
  email?: string;
}

interface CourseDoc {
  title?: string;
  slug?: string;
}

export async function GET(_: Request, { params }: { params: { certificateId: string } }) {
  try {
    await connectToDatabase();

    const cert = await Certificate.findOne({ certificateId: params.certificateId })
      .populate("user", "name email")
      .populate("course", "title slug")
      .lean();

    if (!cert) {
      return NextResponse.json({ success: false, error: "Certificate not found" }, { status: 404 });
    }

    const certTyped = cert as Record<string, unknown>;
    const user = certTyped.user as UserDoc | null;
    const course = certTyped.course as CourseDoc | null;

    return NextResponse.json({
      success: true,
      data: {
        certificateId: certTyped.certificateId,
        issuedAt: certTyped.issuedAt,
        learnerName: user?.name ?? "Learner",
        courseName: course?.title ?? "Course",
        courseSlug: course?.slug ?? "",
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Request failed" }, { status: 500 });
  }
}
