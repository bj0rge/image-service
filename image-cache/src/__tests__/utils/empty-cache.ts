import fs from "node:fs";
import console from "node:console";
import path from "node:path";
import { getConfig } from "../../utils/config";

const CACHE_PATH = path.join(__dirname, "../../cache");

export function emptyCache(filePath?: string): void {
  const { env } = getConfig();
  if (env === "production") {
    console.warn("Trying to empty cache in production: exiting script");
    return;
  }

  const folderPath = filePath || CACHE_PATH;

  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      emptyCache(filePath);
    } else {
      if (filePath.includes(".gitignore")) {
        continue;
      }
      console.log(`Deleting ${filePath}`);
      fs.unlinkSync(filePath);
    }
  }
}
