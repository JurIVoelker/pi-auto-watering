import { NextRequest } from "next/server";
import path from "path";
import fs from "fs";
import {
  getIssueResponse,
  hasServersidePermission,
  UNAUTHORIZED_RESPONSE,
} from "@/lib/api/auth";
import { prisma } from "@/prisma/prisma";
import { v6 } from "uuid";
import sizeOf from "image-size";

export async function POST(request: NextRequest): Promise<Response> {
  const hasPermission = await hasServersidePermission(["server"], request);
  if (!hasPermission) {
    return UNAUTHORIZED_RESPONSE;
  }

  const capturedAt = request.headers.get("x-captured-at");
  if (!capturedAt) {
    return getIssueResponse("capturedAt is required in header x-captured-at", [
      "header",
    ]);
  }

  const capturedAtDate = new Date(capturedAt);
  if (isNaN(capturedAtDate.getTime())) {
    return getIssueResponse("capturedAt is not a valid date", ["header"]);
  }

  const fileName = v6() + ".jpg";
  const filePath = path.join(process.cwd(), "public", "uploads", fileName);
  const publicFilePath = "/uploads/" + fileName;

  if (fs.existsSync(filePath)) {
    return getIssueResponse("File already exists", ["file"]);
  }

  let blob;
  try {
    blob = await request.blob();
  } catch {
    return getIssueResponse("Error reading file", ["file"]);
  }

  if (blob.type.split("/")[0] !== "image") {
    return getIssueResponse("File type not allowed", ["file"]);
  }

  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const dimensions = sizeOf(buffer);
  const { width, height } = dimensions;

  if (!width || !height) {
    return getIssueResponse("Unable to determine image dimensions", ["file"]);
  }

  const image = await prisma.image.create({
    data: {
      plantId: 1,
      capturedAt: capturedAtDate,
      url: publicFilePath,
      width,
      height,
    },
  });

  fs.writeFileSync(filePath, buffer);

  return new Response(JSON.stringify(image), {
    status: 200,
  });
}
