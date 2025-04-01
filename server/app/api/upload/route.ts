import { NextRequest } from "next/server";
import path from "path";
import fs from "fs";
import { getIssueResponse, validateRequest } from "@/lib/api/auth";
import { prisma } from "@/prisma/prisma";
import { v6 } from "uuid";
import sizeOf from "image-size";
import { PLANT_ID } from "@/constants/constants";
import { updateLatestPing } from "@/lib/api/apiUtils";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const config = {
  api: {
    bodyParser: false,
  },
};

const POST_UPLOAD = z.object({
  file: z.string(),
  capturedAt: z.string(),
  width: z.number(),
  height: z.number(),
});

export type POST_UPLOAD_TYPE = z.infer<typeof POST_UPLOAD>;

export async function POST(request: NextRequest): Promise<Response> {
  const { body, error } = await validateRequest(
    request,
    ["server"],
    POST_UPLOAD
  );

  if (error) {
    const status = error[0].message === "Unauthorized" ? 401 : 400;
    return new Response(JSON.stringify({ error }), {
      status,
    });
  }

  const { capturedAt, file, height, width } = body as POST_UPLOAD_TYPE;

  const fileName = v6() + ".jpg";
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadsDir, fileName);
  const publicFilePath = "/uploads/" + fileName;

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  if (fs.existsSync(filePath)) {
    return getIssueResponse("File already exists", ["file"]);
  }

  const buffer = Buffer.from(file, "base64");
  const dimensions = sizeOf(buffer);

  if (dimensions.width !== width || dimensions.height !== height) {
    return getIssueResponse(
      "Image dimensions do not match the provided metadata",
      ["width", "height"]
    );
  }

  if (!["jpg", "jpeg"].includes(dimensions.type || "")) {
    return getIssueResponse("Invalid image format. Only JPG is supported", [
      "file",
    ]);
  }

  const image = await prisma.image.create({
    data: {
      plantId: PLANT_ID,
      capturedAt: capturedAt,
      url: publicFilePath,
      width,
      height,
    },
  });

  await updateLatestPing();

  fs.writeFileSync(filePath, buffer, "base64");

  revalidatePath("/dashboard");

  return new Response(JSON.stringify(image), {
    status: 200,
  });
}
