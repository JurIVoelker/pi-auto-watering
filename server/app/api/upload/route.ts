import { NextRequest } from "next/server";
import path from "path";
import fs from "fs";
import {
  getIssueResponse,
  hasServersidePermission,
  UNAUTHORIZED_RESPONSE,
} from "@/lib/api/auth";

export async function POST(request: NextRequest): Promise<Response> {
  const hasPermission = await hasServersidePermission(["server"], request);
  if (!hasPermission) {
    return UNAUTHORIZED_RESPONSE;
  }

  const fileName = request.headers.get("x-filename");
  if (!fileName) {
    return getIssueResponse("Filename is required in header X-Filename", [
      "header",
    ]);
  }

  // Check if file is allowed
  const allowedExtensions = ["png", "jpg", "jpeg", "gif"];
  const extension = fileName.split(".").pop();
  if (!allowedExtensions.includes(extension || "")) {
    return getIssueResponse("File type not allowed", ["file"]);
  }

  // Check if file already exists
  const filePath = path.join(process.cwd(), "public", "uploads");

  if (fs.existsSync(path.join(filePath, fileName))) {
    return getIssueResponse("File already exists", ["file"]);
  }

  // Get file from request
  let blob;
  try {
    blob = await request.blob();
  } catch {
    return getIssueResponse("Error reading file", ["file"]);
  }

  if (blob.type.split("/")[0] !== "image") {
    return getIssueResponse("File type not allowed", ["file"]);
  }

  // Save file
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  fs.writeFileSync(filePath + "/" + fileName, buffer);

  return new Response(JSON.stringify({ fileName }), {
    status: 200,
  });
}
