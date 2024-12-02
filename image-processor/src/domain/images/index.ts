import type { Sharp } from "sharp";
import { buildImageCacheClient } from "../../clients";
import { blur } from "./image-operations";
import { getConfig } from "../../utils/config";

const imageCache = buildImageCacheClient();

const {
  libraries: {
    blur: { defaultRadius: blurRadius },
  },
} = getConfig();

type FetchAndBlurResult =
  | {
      outcome: "notFound";
    }
  | { outcome: "serverError" }
  | {
      outcome: "found";
      file: {
        buffer: Sharp;
        mimeType: string;
      };
    };

export async function fetchAndBlur(
  fileId: string
): Promise<FetchAndBlurResult> {
  const getImageResult = await imageCache.getImage(fileId);
  if (getImageResult.outcome !== "found") {
    return getImageResult;
  }

  const { file } = getImageResult;
  const blurredImage = blur({ buffer: file.buffer, blurRadius });
  return {
    outcome: "found",
    file: { buffer: blurredImage, mimeType: file.mimeType },
  };
}
