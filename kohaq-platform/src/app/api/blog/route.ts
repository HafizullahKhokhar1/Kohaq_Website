import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/mongoose";
import BlogPost from "@/lib/db/models/BlogPost";

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(24).default(12),
  search: z.string().default(""),
  tag: z.string().default(""),
  category: z.string().default(""),
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams.entries()));

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid query parameters" }, { status: 400 });
    }

    const { page, limit, search, tag, category } = parsed.data;

    const query: Record<string, unknown> = { isPublished: true };

    if (search.trim()) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (tag.trim()) {
      query.tags = tag;
    }

    if (category.trim()) {
      query.category = category;
    }

    await connectToDatabase();

    const [items, total] = await Promise.all([
      BlogPost.find(query)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("author", "name")
        .lean(),
      BlogPost.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: items.map((post) => ({ ...post, _id: String(post._id) })),
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
