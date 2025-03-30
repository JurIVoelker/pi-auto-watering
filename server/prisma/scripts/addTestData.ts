import { prisma } from "../prisma";
import { subDays } from "date-fns";

const generateValues = (startDate: Date, days: number) => {
  const values = [];
  const waterings = [];
  let currentWeight = 2500; // Initial weight
  const baseWeight = 2000; // Base weight that is not reduced by decay
  const decayRate = 0.99; // Exponential decay rate per 5 minutes
  const wateringInterval = 14; // Water every 14 days
  const wateringAmount = 200; // Fixed amount for each watering

  for (let day = 0; day < days; day++) {
    for (let minute = 0; minute < 24 * 60; minute += 60) {
      const measuredAt = new Date(startDate);
      measuredAt.setDate(startDate.getDate() + day);
      measuredAt.setHours(0, minute, 0, 0);

      // Check if watering occurs on this day
      if (day % wateringInterval === 0 && minute === 0) {
        currentWeight += wateringAmount; // Increase weight due to watering
        waterings.push({
          plantId: 1,
          wateredAt: new Date(measuredAt),
          amount: wateringAmount,
        });
      }

      // Add the current weight (including base weight) to the values
      values.push({
        value: currentWeight + baseWeight,
        measuredAt: measuredAt.toISOString(),
      });

      // Apply exponential decay to the current weight
      currentWeight *= decayRate;
    }
  }

  return { values, waterings };
};

const exec = async () => {
  const days = 400;
  const startDate = subDays(new Date(), days - 1);
  const { values, waterings } = generateValues(startDate, days);

  await prisma.weighthMeasurement.deleteMany({});
  await prisma.weighthMeasurement.createMany({
    data: values.map((value) => ({
      weight: value.value,
      measuredAt: new Date(value.measuredAt),
      plantId: 1,
    })),
  });

  await prisma.watering.deleteMany({});
  await prisma.watering.createMany({
    data: waterings,
  });
};

exec();
