import * as path from "path";
import * as fs from "fs";
import { generateBarChart, generateLineChart } from "./chart";

const subfolder = "constant weight";
const dirPath = path.join(__dirname, `./data`);

const filenames = fs.readdirSync(`${dirPath}/${subfolder}`);

type Result = { value: number; timestamp: Date };

const results: Result[] = filenames
  .map((filename: string) => {
    try {
      const fileContent = fs.readFileSync(
        `${dirPath}/${subfolder}/${filename}`,
        "utf-8"
      );
      return JSON.parse(fileContent);
    } catch (error) {
      console.info(
        `Error reading file ${filename}: ${
          (error as Error)?.message || "unknown error"
        }`
      );
      return [];
    }
  })
  .reduce((acc, curr) => [...acc, ...curr], [])
  .map((result: { value: number; timestamp: string }) => {
    const parsedTimestamp = new Date(result.timestamp);
    if (isNaN(parsedTimestamp.getTime())) {
      return null;
    }
    return {
      value: result.value,
      timestamp: parsedTimestamp,
    };
  })
  .sort(
    (a: Result, b: Result) => a.timestamp.getTime() - b.timestamp.getTime()
  );

const divisionCount = 500;

// const max = results.reduce(
//   (acc, curr) => (curr.value > acc ? curr.value : acc),
//   -Infinity
// );

// const min = results.reduce(
//   (acc, curr) => (curr.value < acc ? curr.value : acc),
//   Infinity
// );
const min = 320000;
const max = 400000;

const step = (max - min) / divisionCount;
const histogram = Array.from({ length: divisionCount }, (_, i) => {
  const lowerBound = min + i * step;
  const upperBound = lowerBound + step;
  const count = results.filter(
    (result) => result.value >= lowerBound && result.value < upperBound
  ).length;
  return { step: lowerBound, count };
});

const labels = histogram.map((bin) => bin.step.toFixed(2));
const data = histogram.map((bin) => bin.count);

generateBarChart({ data, labels, width: 1920, height: 1080 });

generateLineChart({
  data: results
    .map((result) => result.value)
    .filter((value) => value < max && value > min),
  width: 1920,
  height: 1080,
  labels: results.map((result) =>
    result.timestamp.toLocaleTimeString("en-US", { hour12: false })
  ),
});
