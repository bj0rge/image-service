import fs from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import type { MultipartFile } from "@fastify/multipart";
import { randomUUID } from "node:crypto";
import { generateUniqueFilename, isMimetypeAnImage } from "./utils";
import { buildDatabase } from "../../infrastructure/in-memory-database";
import { type ImageMimetype } from "./file";

const CACHE_PATH = path.join(__dirname, "../../cache");
const database = buildDatabase();

export async function writeFile(
  multipartFile: MultipartFile,
  filename: string
): Promise<void> {
  await pipeline(
    multipartFile.file,
    fs.createWriteStream(path.join(CACHE_PATH, filename))
  );
}

type StoreFileOutcome =
  | {
      outcome: "success";
      file: { id: string; name: string };
    }
  | {
      outcome: "invalidFileType";
      details: { mimetype: string };
    };

export async function storeFile(
  multipartFile: MultipartFile
): Promise<StoreFileOutcome> {
  const id = randomUUID();
  const name = generateUniqueFilename(multipartFile.filename, id);
  await writeFile(multipartFile, name);

  const mimetype = multipartFile.mimetype;
  if (!isMimetypeAnImage(mimetype)) {
    return { outcome: "invalidFileType", details: { mimetype } };
  }
  database.saveFile({ id, name, mimetype });
  return { outcome: "success", file: { id, name } };
}

type GetFileByIdOutcome =
  | {
      outcome: "found";
      file: { stream: fs.ReadStream; mimetype: ImageMimetype };
    }
  | {
      outcome: "notFound";
    };

export async function getFileById(id: string): Promise<GetFileByIdOutcome> {
  const fileInfo = database.getFile(id);
  if (!fileInfo) {
    return { outcome: "notFound" };
  }

  const filepath = path.join(CACHE_PATH, fileInfo.name);
  const fileStream = fs.createReadStream(filepath);

  return {
    outcome: "found",
    file: { stream: fileStream, mimetype: fileInfo.mimetype },
  };
}
