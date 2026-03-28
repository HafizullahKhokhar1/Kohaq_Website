import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid registration data" }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email: parsed.data.email });

    if (existingUser) {
      return NextResponse.json({ success: false, error: "Email already in use" }, { status: 409 });
    }

    const password = await bcrypt.hash(parsed.data.password, 12);

    const user = await User.create({
      name: parsed.data.name,
      email: parsed.data.email,
      password,
      role: "student",
    });

    return NextResponse.json({
      success: true,
      data: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to register user" }, { status: 500 });
  }
}