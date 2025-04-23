import { prisma } from "../prisma";
import { writeFile } from "fs/promises";
import { join } from "path";
import * as Minio from "minio";

const { BUCKET_NAME, ENDPOINT, ACCESS_KEY, SECRET_KEY } = process.env;

const bucketName = BUCKET_NAME || "undefined";

const minio = new Minio.Client({
  endPoint: ENDPOINT || "undefined",
  useSSL: true,
  accessKey: ACCESS_KEY || "undefined",
  secretKey: SECRET_KEY || "undefined",
});

const exec = async () => {
  const mesaurements = await prisma.weightMeasurement.findMany({
    orderBy: {
      measuredAt: "desc",
    },
  });
  const filePath = join(__dirname, "measurements.json");
  await writeFile(filePath, JSON.stringify(mesaurements, null, 2), "utf-8");
  console.log(`Data written to ${filePath}`);

  await minio.fPutObject(bucketName, "measurements.json", filePath);
  console.log(
    `File uploaded to Minio bucket "${bucketName}" as "measurements.json"`
  );
};

exec();
