import { getImages, PAGE_SIZE } from "@/lib/minioUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const page = parseInt(request.nextUrl.searchParams.get("page") || "0", 10);
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const images = await getImages(start, end);
  return NextResponse.json(images);
}
