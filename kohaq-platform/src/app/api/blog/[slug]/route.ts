import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import BlogPost from "@/lib/db/models/BlogPost";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    await connectToDatabase();

    const post = await BlogPost.findOne({ slug: params.slug, isPublished: true })
      .populate("author", "name")
      .lean();

    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { ...post, _id: String(post._id) },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Request failed" }, { status: 500 });
  }
}
