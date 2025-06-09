import { asyncLog, calculateNextRefillDate } from "@/lib/utils";
import { prisma } from "@/prisma/prisma";
import { format } from "date-fns";
import "dotenv";

const percentageToWater = 80; // Start watering if the water loss percentage is greater than this value

const exec = async () => {
  const latestWatering = await prisma.watering.findFirst({
    orderBy: {
      wateredAt: "desc",
    },
  });

  if (latestWatering === null) {
    console.log("No watering records found.");
    return;
  }

  const weightMeasurementBeforeWatering =
    await prisma.weightMeasurement.findFirst({
      where: {
        measuredAt: {
          gte: new Date(latestWatering.wateredAt.getTime() - 1000 * 60 * 30), // 30 minutes
        },
      },
      orderBy: {
        measuredAt: "asc",
      },
    });

  const weightMeasurementAfterWatering =
    await prisma.weightMeasurement.findFirst({
      where: {
        measuredAt: {
          gte: new Date(latestWatering.wateredAt.getTime() + 1000 * 60 * 30), // 30 minutes
        },
      },
      orderBy: {
        measuredAt: "asc",
      },
    });

  if (
    weightMeasurementBeforeWatering === null ||
    weightMeasurementAfterWatering === null
  ) {
    console.log("No weight measurement records found.");
    return;
  }

  const totalWateringAmount =
    weightMeasurementAfterWatering.weight -
    weightMeasurementBeforeWatering.weight;

  const latestWeightMeasurement = await prisma.weightMeasurement.findFirst({
    orderBy: {
      measuredAt: "desc",
    },
  });

  if (latestWeightMeasurement === null) {
    console.log("No weight measurement records found.");
    return;
  }

  const amountOfLostWater =
    weightMeasurementAfterWatering.weight - latestWeightMeasurement.weight;

  const getDateString = (date: Date) => {
    return `(${format(date, "dd.MM. HH:mm")} Uhr)`;
  };

  const waterLossPercentage = Math.floor(
    (amountOfLostWater / totalWateringAmount) * 100
  );

  const daysAfterLastWatering = Math.floor(
    (new Date().getTime() - latestWatering.wateredAt.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (latestWatering.wateredAt > new Date()) {
    console.log("Latest watering is in the future.");
    asyncLog(`
Weight before watering ${getDateString(
      weightMeasurementBeforeWatering.measuredAt
    )}: ${weightMeasurementBeforeWatering.weight}g
Weight after watering ${getDateString(
      weightMeasurementAfterWatering.measuredAt
    )}: ${weightMeasurementAfterWatering.weight}g
Watering amount: ${Math.floor(totalWateringAmount)}ml
Current weight ${getDateString(latestWeightMeasurement.measuredAt)}: ${
      latestWeightMeasurement.weight
    }g
Water loss until now: ${Math.floor(amountOfLostWater)}ml
Water loss percentage: ${waterLossPercentage}%
Days after last watering: ${daysAfterLastWatering}`);
    return;
  }

  if (waterLossPercentage > percentageToWater) {
    const scheduledWateringDate = new Date(
      new Date().getTime() + 1000 * 60 * 60 * 24 * 2
    );
    scheduledWateringDate.setHours(9, 0, 0, 0);
    const scheduledWatering = scheduledWateringDate.getTime();

    const plantConfig = await prisma.plant.findFirst();

    if (!plantConfig?.id) {
      console.log("No plant configuration found or plant id is missing.");
      return;
    }

    await prisma.watering.create({
      data: {
        wateredAt: new Date(scheduledWatering),
        amount: plantConfig.wateringAmount || 0,
        executed: false,
        plant: {
          connect: { id: plantConfig.id },
        },
      },
    });

    const { refillAt, amountOfWateringsBeforeRefill } =
      await calculateNextRefillDate();

    asyncLog(`
New watering scheduled:

Weight before watering ${getDateString(
      weightMeasurementBeforeWatering.measuredAt
    )}: ${weightMeasurementBeforeWatering.weight}g
Weight after watering ${getDateString(
      weightMeasurementAfterWatering.measuredAt
    )}: ${weightMeasurementAfterWatering.weight}g
Watering amount: ${Math.floor(totalWateringAmount)}ml
Current weight ${getDateString(latestWeightMeasurement.measuredAt)}: ${
      latestWeightMeasurement.weight
    }g
Water loss until now: ${Math.floor(amountOfLostWater)}ml
Water loss percentage: ${waterLossPercentage}%
Days after last watering: ${daysAfterLastWatering}
Scheduled watering for: ${format(
      new Date(scheduledWatering),
      "dd.MM. HH:mm"
    )} o'clock
Refill at: ${format(
      refillAt,
      "dd.MM HH:mm"
    )} o'clock (${amountOfWateringsBeforeRefill} waterings)
    `);

    console.log(
      `Water loss percentage (${waterLossPercentage}%) is greater than ${percentageToWater}% -> watering scheduled for ${format(
        new Date(scheduledWatering),
        "dd.MM. HH:mm"
      )} o'clock.`
    );

    await prisma.plant.update({
      where: { id: plantConfig.id },
      data: {
        waterTankLevel: {
          decrement: plantConfig.wateringAmount || 0,
        },
        refillAt,
        nextWateringAt: new Date(scheduledWatering),
      },
    });
  } else {
    console.log("No watering needed.");
  }
};

exec();
