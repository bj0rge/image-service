import sharp, { type Sharp } from "sharp";

export function blur({
  buffer,
  blurRadius,
}: {
  buffer: Buffer;
  blurRadius: number;
}): Sharp {
  return sharp(buffer).blur(blurRadius);
}
