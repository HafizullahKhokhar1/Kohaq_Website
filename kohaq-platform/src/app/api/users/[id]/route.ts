import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(["student", "intern", "instructor", "partner", "admin"]).optional(),
  bio: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  isVerified: z.boolean().optional(),
});

function invalidId(id: string) {
  if (!isValidObjectId(id)) {
    return NextResponse.json({ success: false, error: "Invalid user id" }, { status: 400 });
  }

  return null;
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const invalid = invalidId(params.id);
    if (invalid) {
      return invalid;
    }

    await connectToDatabase();
    const user = await User.findById(params.id, { password: 0 }).lean();

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch {
    return NextResponse.json({ success: false, error: "Request failed" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const invalid = invalidId(params.id);
    if (invalid) {
      return invalid;
    }

    const body = await request.json();
    const parsed = updateUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid user payload" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findByIdAndUpdate(params.id, parsed.data, {
      new: true,
      projection: { password: 0 },
    }).lean();

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch {
    return NextResponse.json({ success: false, error: "Request failed" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const invalid = invalidId(params.id);
    if (invalid) {
      return invalid;
    }

    await connectToDatabase();
    const deleted = await User.findByIdAndDelete(params.id).lean();

    if (!deleted) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { id: params.id } });
  } catch {
    return NextResponse.json({ success: false, error: "Request failed" }, { status: 500 });
  }
}