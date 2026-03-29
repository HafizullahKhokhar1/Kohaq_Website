import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/mongoose";
import Job from "@/lib/db/models/Job";

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(12),
  search: z.string().default(""),
  domain: z.string().default(""),
  jobType: z.string().default(""),
  location: z.string().default(""),
  salaryMin: z.coerce.number().optional(),
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const parsed = querySchema.safeParse(params);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid query parameters" }, { status: 400 });
    }

    const { page, limit, search, domain, jobType, location, salaryMin } = parsed.data;

    const query: Record<string, unknown> = { isActive: true };

    if (search.trim()) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (domain.trim()) {
      query.domain = domain;
    }

    if (jobType.trim()) {
      query.type = jobType;
    }

    if (location.trim()) {
      query.location = { $regex: location, $options: "i" };
    }

    if (salaryMin !== undefined) {
      query["salary.min"] = { $gte: salaryMin };
    }

    await connectToDatabase();

    const [items, total] = await Promise.all([
      Job.find(query)
        .populate("company", "name logo")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("title company domain type location salary applicationDeadline applicationCount createdAt")
        .lean(),
      Job.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: items.map((job) => ({
          ...job,
          _id: job._id.toString(),
        })),
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
    const jobSchema = z.object({
      title: z.string().min(2),
      company: z.string().min(1),
      description: z.string().optional(),
      requirements: z.array(z.string()).optional(),
      type: z.enum(["full-time", "part-time", "contract", "internship", "remote"]),
      domain: z.string().optional(),
      location: z.string().optional(),
      salary: z
        .object({
          min: z.number().nonnegative().optional(),
          max: z.number().nonnegative().optional(),
          currency: z.string().default("PKR"),
        })
        .optional(),
      applicationDeadline: z.string().datetime().optional(),
      applicationLink: z.string().url().optional(),
    });

    const parsed = jobSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid job payload" }, { status: 400 });
    }

    await connectToDatabase();

    const job = await Job.create({
      ...parsed.data,
      isActive: true,
    });

    return NextResponse.json({ success: true, data: job }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Request failed" }, { status: 500 });
  }
}

