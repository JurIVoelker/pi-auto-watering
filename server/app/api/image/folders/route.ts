import { getImages } from "@/lib/minioUtils";
import { NextResponse } from "next/server";

export async function GET() {
  const images = await getImages();
  return NextResponse.json(images);
}
