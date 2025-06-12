import { filterTypes as filterType } from "@/components/grid/graph-card";
import { prisma } from "@/prisma/prisma";
import { Watering, WeightMeasurement } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const limitWeightsToLength = (
  weights: WeightMeasurement[],
  count = 50
) => {
  const mergeCount = Math.ceil(weights.length / count);
  if (mergeCount <= 1) return weights;
  const mergedWeights: WeightMeasurement[] = [];
  let avg = 0;
  let resetIndex = mergeCount;
  weights.forEach((m, index) => {
    avg += m.weight;
    if (index + 1 === resetIndex) {
      mergedWeights.push({ ...m, weight: avg / mergeCount });
      resetIndex += mergeCount;
      avg = 0;
    }
  });
  return mergedWeights;
};

export type ChartData = { weight: number; watering: number; date: Date }[];

export const getChartData = (
  weights: WeightMeasurement[],
  filterType: filterType,
  waterings: Watering[]
): ChartData => {
  const today = endOfDay(new Date());
  const startOfToday = startOfDay(today);

  const latestWatering = waterings[0];
  const chartFilter = {
    "last-watering": (date: Date) => date >= latestWatering?.wateredAt,
    today: (date: Date) => date >= startOfToday,
    "1-week": (date: Date) => date >= subDays(today, 7),
    "1-month": (date: Date) => date >= subDays(today, 30),
    "1-year": (date: Date) => date >= subDays(today, 365),
    max: () => true,
  };

  const filteredWeights = limitWeightsToLength(
    weights.filter(
      (weight) =>
        chartFilter[filterType](weight?.measuredAt) &&
        weight?.measuredAt <= today
    )
  );

  const filteredWaterings = waterings.filter(
    (watering) =>
      chartFilter[filterType](watering?.wateredAt) &&
      watering?.wateredAt <= today
  );

  const combinedData = combineData(filteredWeights, filteredWaterings);
  return combinedData;
};

const combineData = (weights: WeightMeasurement[], waterings: Watering[]) => {
  const combinedData: ChartData = weights.map((m) => ({
    watering: 0,
    weight: m?.weight,
    date: m?.measuredAt,
  }));

  waterings.forEach((w) => {
    const date = new Date(w.wateredAt).getTime();
    let closestIndex = 0;
    let closestDiff = Math.abs(weights[0]?.measuredAt?.getTime() - date);

    for (let i = 1; i < weights.length; i++) {
      const diff = Math.abs(weights[i]?.measuredAt?.getTime() - date);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestIndex = i;
      }
    }

    const closestWeight = weights[closestIndex];
    if (closestWeight) {
      const existingEntry = combinedData.find(
        (entry) =>
          entry?.date?.getTime() === closestWeight?.measuredAt?.getTime()
      );
      if (existingEntry) {
        existingEntry.watering += w.amount;
      }
    } else {
      combinedData.push({
        watering: w?.amount,
        weight: 0,
        date: new Date(w?.wateredAt),
      });
    }
  });

  const sortedData = combinedData.sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  return sortedData;
};

export const calculateNextRefillDate = async () => {
  const plantConfig = await prisma.plant.findFirst();
  if (!plantConfig) {
    throw new Error("No plant configuration found");
  }

  const lastWaterings = await prisma.watering.findMany({
    where: {
      plantId: plantConfig.id,
    },
    orderBy: {
      wateredAt: "desc",
    },
    take: 4,
  });

  let avgDaysBetweenWaterings: number;
  if (lastWaterings.length < 2) {
    // Default to 7 days if not enough data
    avgDaysBetweenWaterings = 7;
  } else {
    // Calculate average days between all waterings
    const intervals = lastWaterings
      .slice(0, lastWaterings.length - 1)
      .map(
        (w, i) =>
          (w.wateredAt.getTime() - lastWaterings[i + 1].wateredAt.getTime()) /
          (1000 * 60 * 60 * 24)
      );
    avgDaysBetweenWaterings = Math.floor(
      intervals.reduce((sum, val) => sum + val, 0) / intervals.length
    );
  }

  const amountOfWateringsBeforeRefill =
    plantConfig.waterTankLevel !== 0 && plantConfig.wateringAmount !== 0
      ? Math.floor(plantConfig.waterTankLevel / plantConfig.wateringAmount)
      : 1;

  const refillAt = new Date(
    new Date().getTime() +
      amountOfWateringsBeforeRefill *
        avgDaysBetweenWaterings *
        1000 *
        60 *
        60 *
        24
  );
  return { refillAt, avgDaysBetweenWaterings, amountOfWateringsBeforeRefill };
};

export const asyncLog = async (message: string) => {
  console.log(message);
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("Telegram bot token or chat ID is not set.");
    return;
  }
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const data = {
    chat_id: TELEGRAM_CHAT_ID, // The chat ID where the message will be sent
    text: message, // The message content
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to send Telegram message: ${response.status} ${response.statusText} - ${errorText}`
      );
    }
  } catch (error) {
    console.error("Error sending Telegram message:", error);
  }
};
