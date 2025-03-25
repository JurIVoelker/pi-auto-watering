import { prisma } from "../prisma";

const exec = async () => {
  const existingPlants = await prisma.plant.findMany();
  console.log({ existingPlants });
  const existingImages = await prisma.image.findMany();
  console.log({ existingImages });
};

exec();
