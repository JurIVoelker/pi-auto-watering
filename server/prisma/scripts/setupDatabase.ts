import * as fs from "fs";
import * as path from "path";

const databaseDir = path.join(__dirname, "../db");
const databaseFile = path.join(databaseDir, "database.db");

// Check if the directory exists, if not, create it
if (!fs.existsSync(databaseDir)) {
  fs.mkdirSync(databaseDir, { recursive: true });
  console.log(`Directory created: ${databaseDir}`);
} else {
  console.log(`Directory already exists: ${databaseDir}`);
}

// Check if the file exists, if not, create it
if (!fs.existsSync(databaseFile)) {
  fs.writeFileSync(databaseFile, "");
  console.log(`File created: ${databaseFile}`);
} else {
  console.log(`File already exists: ${databaseFile}`);
}
