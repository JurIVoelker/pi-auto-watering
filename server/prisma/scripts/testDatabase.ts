import { prisma } from "../prisma";

const exec = async () => {
  await prisma.watering.deleteMany({
    where: {
      plantId: 1,
    },
  });
};

exec();
