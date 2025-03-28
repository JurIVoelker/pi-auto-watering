import { PLANT_ID } from "@/constants/constants";
import { prisma } from "@/prisma/prisma";

export const updateLatestPing = async () => {
  await prisma.plant.update({
    where: { id: PLANT_ID },
    data: {
      lastPingAt: new Date(),
    },
  });
};
