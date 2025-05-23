import { PLANT_ID } from "@/constants/constants";
import { updateLatestPing } from "@/lib/api/apiUtils";
import { validateRequest } from "@/lib/api/auth";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { z } from "zod";

const POST_MEASURE_WEIGHT_SCHEMA = z.object({
  values: z.array(
    z.object({
      value: z.number(),
      measuredAt: z.string(),
    })
  ),
});

export type POST_MEASURE_WEIGHT_TYPE = z.infer<
  typeof POST_MEASURE_WEIGHT_SCHEMA
>;

export async function POST(req: NextRequest) {
  const { body, error } = await validateRequest(
    req,
    ["server"],
    POST_MEASURE_WEIGHT_SCHEMA
  );

  if (error) {
    const status = error[0].message === "Unauthorized" ? 401 : 400;
    return new Response(JSON.stringify({ error }), {
      status,
    });
  }

  const { values } = body as POST_MEASURE_WEIGHT_TYPE;

  const measurement = await prisma.weightMeasurement.createManyAndReturn({
    data: values.map((value) => ({
      weight: value.value,
      measuredAt: new Date(value.measuredAt),
      plantId: PLANT_ID,
    })),
  });

  await updateLatestPing();
  revalidatePath("/dashboard");

  return new Response(JSON.stringify({ ...measurement }), {
    status: 200,
  });
}
