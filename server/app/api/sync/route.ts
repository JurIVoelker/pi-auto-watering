import { PLANT_ID } from "@/constants/constants";
import { updateLatestPing } from "@/lib/api/apiUtils";
import { getIssueResponse, hasServersidePermission } from "@/lib/api/auth";
import { prisma } from "@/prisma/prisma";
import { subDays } from "date-fns";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const hasPermission = await hasServersidePermission(["server"], req);
  if (!hasPermission) return getIssueResponse("Unauthorized", ["header"], 401);

  const todayBeforeOneMonth = subDays(new Date(), 30);

  const res = await prisma.watering.deleteMany({
    where: {
      wateredAt: {
        lte: todayBeforeOneMonth,
      },
    },
  });

  if (res.count !== 0) {
    console.info(
      `Deleted ${res.count} waterings for beeing to long in the past`
    );
  }

  const wateringsInPast = await prisma.watering.findMany({
    where: {
      executed: false,
      wateredAt: {
        lte: new Date(),
      },
    },
  });

  await prisma.watering.deleteMany({
    where: {
      executed: false,
      wateredAt: {
        lte: new Date(),
      },
    },
  });

  const wateringAmount = wateringsInPast.reduce(
    (val, akk) => val + akk.amount,
    0
  );
  if (wateringAmount > 0) {
    const plant = await prisma.plant.findFirst();
    await prisma.plant.update({
      where: {
        id: PLANT_ID,
      },
      data: {
        waterTankLevel: Math.max(
          (plant?.waterTankLevel || 0) - wateringAmount,
          0
        ),
      },
    });
  }

  await updateLatestPing();

  return new Response(JSON.stringify({ waterAmount: wateringAmount }), {
    status: 200,
  });
}
