import { PLANT_ID } from "@/constants/constants";
import { prisma } from "../prisma";

const exec = async () => {
  const existingPlant = await prisma.plant.findUnique({ where: { id: 1 } });
  if (existingPlant) {
    console.log("Default plant already exists: ", existingPlant);
    return;
  }

  const res = await prisma.plant.create({
    data: {
      name: "Default Plant",
      description: "This is the default plant",
      id: PLANT_ID,
    },
  });

  console.log(res);
};

exec();
