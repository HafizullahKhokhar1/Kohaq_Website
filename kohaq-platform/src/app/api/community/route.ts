import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { connectToDatabase } from "@/lib/db/mongoose";
import Thread from "@/lib/db/models/Thread";

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(24).default(12),
  search: z.string().default(""),
  category: z.string().default(""),
});

const createThreadSchema = z.object({
  title: z.string().min(4).max(180),
  content: z.string().min(4).max(8000),
  category: z.string().default("General"),
  tags: z.array(z.string()).default([]),
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams.entries()));

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid query parameters" }, { status: 400 });
    }

    const { page, limit, search, category } = parsed.data;

    const query: Record<string, unknown> = {};

    if (search.trim()) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (category.trim()) {
      query.category = category;
    }

    await connectToDatabase();

    const [items, total] = await Promise.all([
      Thread.find(query)
        .populate("author", "name")
        .sort({ isPinned: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Thread.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: items.map((thread) => ({ ...thread, _id: String(thread._id) })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.max(1, Math.ceil(total / limit)),
        },
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Request failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createThreadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid thread payload" }, { status: 400 });
    }

    await connectToDatabase();

    const thread = await Thread.create({
      ...parsed.data,
      author: session.user.id,
    });

    return NextResponse.json(
      {
        success: true,
        data: { ...thread.toObject(), _id: String(thread._id) },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ success: false, error: "Request failed" }, { status: 500 });
  }
}

