import * as path from "path";
import * as fs from "fs";
export type Result = { weight: number; measuredAt: Date };

export const readValues = (subfolder: string) => {
  const dirPath = path.join(__dirname, `./data`);

  const filenames = fs.readdirSync(`${dirPath}/${subfolder}`);

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
    .map((result: Result) => {
      const parsedTimestamp = new Date(result.measuredAt);
      if (isNaN(parsedTimestamp.getTime())) {
        return null;
      }
      return {
        weight: result.weight,
        measuredAt: parsedTimestamp,
      };
    })
    .sort(
      (a: Result, b: Result) => a.measuredAt.getTime() - b.measuredAt.getTime()
    )
    .map((result: Result) => ({ ...result, weight: result.weight - 6000 }));
  return results;
};
