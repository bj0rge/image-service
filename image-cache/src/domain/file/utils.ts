import { ImageMimetype } from "./file";

export function generateUniqueFilename(filename: string, id: string): string {
  const filenameParts = filename.split(".");
  if (filenameParts.length === 1) {
    return `${filename}-${id}`;
  }
  const fileExtension = filenameParts.pop();
  return `${filenameParts.join(".")}-${id}.${fileExtension}`;
}

export function isMimetypeAnImage(mimetype: string): mimetype is ImageMimetype {
  return mimetype.startsWith("image/");
}
