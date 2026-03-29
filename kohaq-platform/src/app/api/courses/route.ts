import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/mongoose";
import Course from "@/lib/db/models/Course";

const createCourseSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  shortDesc: z.string().max(160).optional(),
  category: z.string().optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  price: z.number().min(0).optional(),
  thumbnail: z.string().optional(),
  isPublished: z.boolean().optional(),
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
    const limit = Math.min(20, Math.max(1, Number(url.searchParams.get("limit") ?? "12")));
    const search = (url.searchParams.get("search") ?? "").trim();
    const category = (url.searchParams.get("category") ?? "").trim();
    const level = (url.searchParams.get("level") ?? "").trim();
    const price = (url.searchParams.get("price") ?? "").trim();

    const query: Record<string, unknown> = { isPublished: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    if (price === "free") {
      query.price = 0;
    }

    if (price === "paid") {
      query.price = { $gt: 0 };
    }

    await connectToDatabase();

    const [items, total] = await Promise.all([
      Course.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("title slug shortDesc thumbnail category level price totalDuration enrollmentCount rating")
        .lean(),
      Course.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items,
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
    const parsed = createCourseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid course payload" }, { status: 400 });
    }

    await connectToDatabase();

    const existing = await Course.findOne({ slug: parsed.data.slug });
    if (existing) {
      return NextResponse.json({ success: false, error: "Course slug already exists" }, { status: 409 });
    }

    const course = await Course.create({
      ...parsed.data,
      price: parsed.data.price ?? 0,
      isPublished: parsed.data.isPublished ?? false,
    });

    return NextResponse.json({ success: true, data: course }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Request failed" }, { status: 500 });
  }
}

