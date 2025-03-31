import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const schemaPath = resolve(__dirname, "../../prisma/schema.prisma");

// Read the existing schema file
const schema = readFileSync(schemaPath, "utf-8");

// Replace the datasource block
const updatedSchema = schema.replace(
  /datasource db \{\s*provider = "sqlite"\s*url\s*=\s*"file:\.\/db\/database\.db"\s*\}/,
  `datasource db {
  provider = "postgresql"
  url      = env("DB_URL")
}`
);

// Write the updated schema back to the file
writeFileSync(schemaPath, updatedSchema, "utf-8");

console.log("Datasource updated successfully!");
