import { PLANT_ID } from "@/constants/constants";
import { validateRequest } from "@/lib/api/auth";
import { prisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const CONFIG_SCHEMA = z.object({
  nextWateringAt: z.string().optional(),
  wateringAmount: z.number().optional(),
  waterTankVolume: z.number().optional(),
  waterTankLevel: z.number().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  refillAt: z.string().optional(),
});

export type CONFIG_TYPE = z.infer<typeof CONFIG_SCHEMA>;

export async function POST(req: NextRequest) {
  const { body, error } = await validateRequest(
    req,
    ["user", "server"],
    CONFIG_SCHEMA
  );

  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 400,
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

  return NextResponse.json(res);
}
