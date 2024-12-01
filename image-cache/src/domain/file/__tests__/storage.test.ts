import { it, describe } from "node:test";
import { ok } from "node:assert";
import type { MultipartFile } from "@fastify/multipart";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { faker } from "@faker-js/faker";
import { writeFile } from "../storage";
import { emptyCache } from "../../../__tests__/utils/empty-cache";

describe("writeFile()", () => {
  describe("given a multipart file and a filename", () => {
    it("stores the file with the given filename", async () => {
      await emptyCache();
      const filename = faker.system.commonFileName();
      const multipartFile = {
        file: Readable.from(faker.lorem.text()),
        filename,
        mimetype: "image/jpeg",
      } as unknown as MultipartFile;

      await writeFile(multipartFile, filename);
      const isFileCreated = fs.existsSync(
        path.join(__dirname, "../../../cache", filename)
      );

      ok(isFileCreated);
    });
  });
});
