import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/db/mongoose";
import Job from "@/lib/db/models/Job";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ success: false, error: "Invalid job id" }, { status: 400 });
    }

    await connectToDatabase();

    const job = await Job.findById(params.id).populate("company").populate("postedBy", "name email").lean();

    if (!job) {
      return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: job });
  } catch {
    return NextResponse.json({ success: false, error: "Request failed" }, { status: 500 });
  }
}
