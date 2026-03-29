import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["student", "intern", "instructor", "partner", "admin"]).optional(),
});

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 }).limit(100).lean();
    return NextResponse.json({ success: true, data: users });
  } catch {
    return NextResponse.json({ success: false, error: "Request failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid user payload" }, { status: 400 });
    }

    await connectToDatabase();
    const existing = await User.findOne({ email: parsed.data.email });

    if (existing) {
      return NextResponse.json({ success: false, error: "Email already exists" }, { status: 409 });
    }

    const user = await User.create({
      name: parsed.data.name,
      email: parsed.data.email,
      role: parsed.data.role ?? "student",
      isVerified: false,
    });

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Request failed" }, { status: 500 });
  }
}

