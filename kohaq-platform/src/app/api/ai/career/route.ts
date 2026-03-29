import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({ success: true, data: [] });
  } catch {
    return NextResponse.json({ success: false, error: "Request failed" }, { status: 500 });
  }
}

export async function POST() {
  try {
    return NextResponse.json({ success: true, data: null });
  } catch {
    return NextResponse.json({ success: false, error: "Request failed" }, { status: 500 });
  }
}

