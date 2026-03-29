import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/mongoose";
import Project from "@/lib/db/models/Project";

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(24).default(12),
  search: z.string().default(""),
  tag: z.string().default(""),
  featured: z.enum(["true", "false", ""]).default(""),
});

const createSchema = z.object({
  title: z.string().min(2),
  description: z.string().default(""),
  thumbnail: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  youtubeVideoId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  resources: z
    .array(
      z.object({
        name: z.string().min(1),
        url: z.string().url(),
      })
    )
    .default([]),
  isFeatured: z.boolean().default(false),
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams.entries()));

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid query parameters" }, { status: 400 });
    }

    const { page, limit, search, tag, featured } = parsed.data;

    const query: Record<string, unknown> = {};

    if (search.trim()) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (tag.trim()) {
      query.tags = tag;
    }

    if (featured === "true") {
      query.isFeatured = true;
    }

    if (featured === "false") {
      query.isFeatured = false;
    }

    await connectToDatabase();

    const [items, total] = await Promise.all([
      Project.find(query)
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Project.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: items.map((project) => ({ ...project, _id: String(project._id) })),
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
    const body = await request.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    await connectToDatabase();

    const project = await Project.create(parsed.data);

    return NextResponse.json(
      {
        success: true,
        data: { ...project.toObject(), _id: String(project._id) },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ success: false, error: "Request failed" }, { status: 500 });
  }
}
