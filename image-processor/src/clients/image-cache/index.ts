import { Readable } from "node:stream";
import { getConfig } from "../../utils/config";
import { streamToBuffer } from "../../utils/stream";

const {
  dependencies: { imageCacheService },
} = getConfig();

type GetImageResult =
  | {
      outcome: "notFound";
    }
  | { outcome: "serverError" }
  | {
      outcome: "found";
      file: {
        buffer: Buffer;
        mimeType: string;
      };
    };

type ImageCacheClient = {
  getImage: (fileId: string) => Promise<GetImageResult>;
};

// We should provide fetch as a dependency to this function
// So that we could mock it and write tests
export const buildImageCacheClient = (): ImageCacheClient => {
  const getImage: ImageCacheClient["getImage"] = async (fileId) => {
    const fetchResponse = await fetch(
      `${imageCacheService.baseUrl}/images/${fileId}`
    );

    if (fetchResponse.status === 404) {
      return { outcome: "notFound" };
    }

    const imageStream = fetchResponse.body;
    if (!fetchResponse.ok || !imageStream) {
      return { outcome: "serverError" };
    }

    const mimeType =
      fetchResponse.headers.get("content-type") || "application/octet-stream";

    const nodeStream = Readable.from(imageStream);
    const buffer = await streamToBuffer(nodeStream);

    return {
      outcome: "found",
      file: {
        buffer,
        mimeType,
      },
    };
  };

  return {
    getImage,
  };
};
