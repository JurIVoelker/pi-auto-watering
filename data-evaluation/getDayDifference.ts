import { readValues } from "./utils";
import { getDay } from "date-fns";

const subfolder = "values-with-median";
const results = readValues(subfolder);

let prev;
for (const result of results) {
  if (!prev) prev = result;
  const day = getDay(result.measuredAt);
  const prevDay = getDay(prev.measuredAt);
  if (day === prevDay) continue;
  const diff = result.weight - prev.weight;
  console.log(`On day ${day}: ${Math.floor(diff)}g`);

  prev = result;
}
