import { PLANT_ID } from "@/constants/constants";
import { validateRequest } from "@/lib/api/auth";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const CONFIG_SCHEMA = z.object({
  nextWateringAt: z.string().datetime().optional(),
  wateringAmount: z.number().optional(),
  waterTankVolume: z.number().optional(),
  waterTankLevel: z.number().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  refillAt: z.string().datetime().optional(),
});

export type CONFIG_TYPE = z.infer<typeof CONFIG_SCHEMA>;

export async function POST(req: NextRequest) {
  const { body, error } = await validateRequest(
    req,
    ["user", "server"],
    CONFIG_SCHEMA
  );

  if (error) {
    const status = error[0].message === "Unauthorized" ? 401 : 400;
    return new Response(JSON.stringify({ error }), {
      status,
    });
  }

  const {
    nextWateringAt,
    waterTankLevel,
    waterTankVolume,
    wateringAmount,
    name,
    description,
    refillAt,
  } = body as CONFIG_TYPE;

  const res = await prisma.plant.update({
    where: {
      id: PLANT_ID,
    },
    data: {
      nextWateringAt: nextWateringAt ? new Date(nextWateringAt) : undefined,
      wateringAmount,
      waterTankVolume,
      waterTankLevel,
      name,
      description,
      refillAt,
    },
  });

  revalidatePath("/dashboard");

  return NextResponse.json(res);
}
