import { PLANT_ID } from "@/constants/constants";
import { updateLatestPing } from "@/lib/api/apiUtils";
import { validateRequest } from "@/lib/api/auth";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { z } from "zod";

const POST_WATER_SCHEMA = z.object({
  wateredAt: z.string(),
  amount: z.number().min(0),
  executed: z.boolean().optional(),
});

export type POST_WATER_TYPE = z.infer<typeof POST_WATER_SCHEMA>;

export async function POST(req: NextRequest) {
  const { body, error } = await validateRequest(
    req,
    ["server", "user"],
    POST_WATER_SCHEMA
  );

  if (error) {
    const status = error[0].message === "Unauthorized" ? 401 : 400;
    return new Response(JSON.stringify({ error }), {
      status,
    });
  }

  const { amount, wateredAt, executed } = body as POST_WATER_TYPE;

  const watering = await prisma.watering.create({
    data: {
      amount,
      wateredAt: new Date(wateredAt),
      plantId: PLANT_ID,
      executed,
    },
  });

  await updateLatestPing();
  revalidatePath("/dashboard");

  return new Response(JSON.stringify({ ...watering }), {
    status: 200,
  });
}
