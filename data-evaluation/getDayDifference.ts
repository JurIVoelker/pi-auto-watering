import { readValues } from "./utils";
import { getDay, format } from "date-fns";

const subfolder = "values-with-median";
const results = readValues(subfolder);

let prev;
for (const result of results) {
  if (!prev) prev = result;
  const day = getDay(result.measuredAt);
  const prevDay = getDay(prev.measuredAt);
  if (day === prevDay) continue;
  const diff = result.weight - prev.weight;
  console.log(`On ${format(result.measuredAt, "dd.MM")}: ${Math.floor(diff)}g`);

  prev = result;
}
