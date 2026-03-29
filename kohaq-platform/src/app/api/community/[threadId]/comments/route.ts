import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { connectToDatabase } from "@/lib/db/mongoose";
import Thread from "@/lib/db/models/Thread";
import Comment from "@/lib/db/models/Comment";

const commentSchema = z.object({
  content: z.string().min(1).max(2000),
  parentComment: z.string().optional(),
});

export async function GET(_: Request, { params }: { params: { threadId: string } }) {
  try {
    if (!isValidObjectId(params.threadId)) {
      return NextResponse.json({ success: false, error: "Invalid thread id" }, { status: 400 });
    }

    await connectToDatabase();

    const comments = await Comment.find({ thread: params.threadId })
      .populate("author", "name")
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: comments.map((comment) => ({ ...comment, _id: String(comment._id) })),
    });
  } catch {
    return NextResponse.json({ success: false, error: "Request failed" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { threadId: string } }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!isValidObjectId(params.threadId)) {
      return NextResponse.json({ success: false, error: "Invalid thread id" }, { status: 400 });
    }

    const body = await request.json();
    const parsed = commentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid comment payload" }, { status: 400 });
    }

    await connectToDatabase();

    const thread = await Thread.findById(params.threadId);
    if (!thread) {
      return NextResponse.json({ success: false, error: "Thread not found" }, { status: 404 });
    }

    const comment = await Comment.create({
      thread: params.threadId,
      author: session.user.id,
      content: parsed.data.content,
      parentComment: parsed.data.parentComment,
    });

    await Thread.updateOne({ _id: params.threadId }, { $inc: { commentCount: 1 } });

    return NextResponse.json(
      {
        success: true,
        data: { ...comment.toObject(), _id: String(comment._id) },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ success: false, error: "Request failed" }, { status: 500 });
  }
}
