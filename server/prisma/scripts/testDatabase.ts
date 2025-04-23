import { prisma } from "../prisma";

const exec = async () => {
  const mesaurements = await prisma.weightMeasurement.findMany({
    take: 100,
    orderBy: {
      measuredAt: "desc",
    },
  });
  console.log(mesaurements);
};

exec();
