import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { connectToDatabase } from "@/lib/db/mongoose";
import Job from "@/lib/db/models/Job";
import Application from "@/lib/db/models/Application";

const applySchema = z.object({
  resume: z.string().url(),
  coverLetter: z.string().optional(),
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ success: false, error: "Invalid job id" }, { status: 400 });
    }

    const body = await request.json();
    const parsed = applySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid application payload" }, { status: 400 });
    }

    await connectToDatabase();

    const job = await Job.findById(params.id);
    if (!job) {
      return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 });
    }

    const existing = await Application.findOne({ user: session.user.id, job: job._id });
    if (existing) {
      return NextResponse.json({ success: false, error: "You have already applied to this job" }, { status: 409 });
    }

    const application = await Application.create({
      user: session.user.id,
      job: job._id,
      resume: parsed.data.resume,
      coverLetter: parsed.data.coverLetter ?? "",
      status: "pending",
    });

    await Job.updateOne({ _id: job._id }, { $inc: { applicationCount: 1 } });

    return NextResponse.json({ success: true, data: application }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Request failed" }, { status: 500 });
  }
}
