import { readValues } from "./utils";
import { generateBarChart, generateLineChart } from "./chart";

const subfolder = "values-with-median";

const divisionCount = 500;
const results = readValues(subfolder);

const max = results.reduce(
  (acc, curr) => (curr.weight > acc ? curr.weight : acc),
  -Infinity
);

const min = results.reduce(
  (acc, curr) => (curr.weight < acc ? curr.weight : acc),
  Infinity
);
// const min = 570000;
// const max = 750000;

const step = (max - min) / divisionCount;
const histogram = Array.from({ length: divisionCount }, (_, i) => {
  const lowerBound = min + i * step;
  const upperBound = lowerBound + step;
  const count = results.filter(
    (result) => result.weight >= lowerBound && result.weight < upperBound
  ).length;
  return { step: lowerBound, count };
});

const labels = histogram.map((bin) => bin.step.toFixed(2));
const data = histogram.map((bin) => bin.count);

generateBarChart({ data, labels, width: 1920, height: 1080 });

generateLineChart({
  data: results
    .map((result) => result.weight)
    .filter((value) => value < max && value > min),
  width: 1920,
  height: 1080,
  labels: results.map((result) =>
    result.measuredAt.toLocaleTimeString("en-US", { hour12: false })
  ),
});
