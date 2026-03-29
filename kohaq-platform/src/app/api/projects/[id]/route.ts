import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import Project from "@/lib/db/models/Project";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    const project = await Project.findById(params.id).lean();

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { ...project, _id: String(project._id) },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Request failed" }, { status: 500 });
  }
}
