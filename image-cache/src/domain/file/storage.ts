import fs from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import type { MultipartFile } from "@fastify/multipart";
import { randomUUID } from "node:crypto";
import { generateUniqueFilename } from "./utils";

export async function writeFile(
  multipartFile: MultipartFile,
  filename: string
): Promise<void> {
  await pipeline(
    multipartFile.file,
    fs.createWriteStream(path.join(__dirname, "../../cache", filename))
  );
}

export async function storeFile(
  multipartFile: MultipartFile
): Promise<{ id: string; name: string }> {
  const id = randomUUID();
  const name = generateUniqueFilename(multipartFile.filename, id);
  await writeFile(multipartFile, name);
  return { id, name };
}
