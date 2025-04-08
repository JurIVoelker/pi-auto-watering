import { Client } from "minio";
import path from "path";
import fs from "fs/promises";

export const getLatestImage = async () => {
  const { ENDPOINT, ACCESS_KEY, SECRET_KEY } = process.env;
  const minio = new Client({
    endPoint: ENDPOINT || "undefined",
    useSSL: true,
    accessKey: ACCESS_KEY || "undefined",
    secretKey: SECRET_KEY || "undefined",
  });

  const data: {
    name?: string;
    lastModified?: Date;
    etag?: string;
    size?: number;
  }[] = [];

  const bucketName = "raspberry-pi-images";

  try {
    await new Promise<void>((resolve, reject) => {
      const stream = minio.listObjects(bucketName, "", true);

      stream.on("data", (obj) => {
        data.push(obj);
      });

      stream.on("end", () => {
        resolve();
      });

      stream.on("error", (err) => {
        console.error(err);
        reject(err);
      });
    });

    const sortedData = data.sort((a, b) => {
      if (!a.name || !b.name) return 0;
      const aDate = a?.name.split("_")[0].split("/")[1];
      const aTime = a?.name.split("_")[1].split("-").join(":");
      const aDateString = `${aDate}T${aTime}.000Z`;
      const aDateObj = new Date(aDateString);
      const bDate = b?.name.split("_")[0].split("/")[1];
      const bTime = b?.name.split("_")[1].split("-").join(":");
      const bDateString = `${bDate}T${bTime}.000Z`;
      const bDateObj = new Date(bDateString);
      return bDateObj.getTime() - aDateObj.getTime();
    });

    if (sortedData.length === 0) {
      return null;
    }

    const fileToFetch = sortedData[0];
    const outputDir = path.resolve(
      path
        .dirname(new URL(import.meta.url).pathname)
        .replace(/^\/[A-Za-z]:/, ""),
      "../public/uploads"
    );
    const outputFile = path.join(
      outputDir,
      fileToFetch.name?.split("/")[1] || ""
    );

    if (
      await fs
        .access(outputFile)
        .then(() => true)
        .catch(() => false)
    ) {
      console.log(`File ${outputFile} already exists. Skipping download.`);
      return {
        name: "uploads/" + fileToFetch?.name?.split("/")[1],
        width: parseInt(fileToFetch?.name?.split("_")[2]?.split("-")[0] || "0"),
        height: parseInt(
          fileToFetch?.name?.split("_")[2]?.split("-")[1] || "0"
        ),
      };
    }

    await minio.fGetObject(bucketName, fileToFetch.name || "", outputFile);

    console.log(`Downloaded ${fileToFetch.name} to ${outputFile}`);

    const dimensions = fileToFetch?.name?.split("_")[2];
    const width = parseInt(dimensions?.split("-")[0] || "0");
    const height = parseInt(dimensions?.split("-")[1] || "0");

    const image = {
      name: "uploads/" + fileToFetch?.name?.split("/")[1],
      width,
      height,
    };
    return image;
  } catch (error) {
    console.error("Error fetching objects:", error);
    return null;
  }
};
