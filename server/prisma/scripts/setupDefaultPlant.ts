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
      id: 1,
    },
  });

  console.log(res);
};

exec();
