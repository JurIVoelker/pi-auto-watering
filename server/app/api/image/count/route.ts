import { getPageCount } from "@/lib/minioUtils";
import { NextResponse } from "next/server";

export async function GET() {
  const pageCount = await getPageCount();
  return NextResponse.json({ pageCount });
}
