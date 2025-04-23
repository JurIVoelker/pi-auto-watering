import { prisma } from "../prisma";
import { writeFile } from "fs/promises";
import { join } from "path";

const exec = async () => {
  const mesaurements = await prisma.weightMeasurement.findMany({
    orderBy: {
      measuredAt: "desc",
    },
  });
  const filePath = join(__dirname, "measurements.json");
  await writeFile(filePath, JSON.stringify(mesaurements, null, 2), "utf-8");
  console.log(`Data written to ${filePath}`);
};

exec();
