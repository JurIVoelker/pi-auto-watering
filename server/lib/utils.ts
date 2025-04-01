import { filterTypes as filterType } from "@/components/grid/graph-card";
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
