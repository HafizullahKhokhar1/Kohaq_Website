import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/db/mongoose";
import Thread from "@/lib/db/models/Thread";

export async function GET(_: Request, { params }: { params: { threadId: string } }) {
  try {
    if (!isValidObjectId(params.threadId)) {
      return NextResponse.json({ success: false, error: "Invalid thread id" }, { status: 400 });
    }

    await connectToDatabase();

    const thread = await Thread.findById(params.threadId).populate("author", "name").lean();

    if (!thread) {
      return NextResponse.json({ success: false, error: "Thread not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { ...thread, _id: String(thread._id) },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Request failed" }, { status: 500 });
  }
}
