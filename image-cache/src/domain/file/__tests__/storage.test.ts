import { it, describe } from "node:test";
import { ok, equal } from "node:assert";
import type { MultipartFile } from "@fastify/multipart";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { faker } from "@faker-js/faker";
import { writeFile, storeFile, getFileById } from "../storage";

const CACHE_PATH = path.join(__dirname, "../../../cache");

describe("writeFile()", () => {
  describe("given a multipart file and a filename", () => {
    it("stores the file with the given filename", async () => {
      const filename = faker.system.commonFileName();
      const multipartFile = {
        file: Readable.from(faker.lorem.text()),
        filename,
        mimetype: "image/jpeg",
      } as unknown as MultipartFile;

      await writeFile(multipartFile, filename);
      const isFileCreated = fs.existsSync(path.join(CACHE_PATH, filename));

      ok(isFileCreated);
    });
  });
});

describe("storeFile()", () => {
  describe("given a multipart file", () => {
    describe("that is an image", () => {
      it("stores the file and returns the file id and name", async () => {
        const filename = "filename.jpeg";
        const multipartFile = {
          file: Readable.from(faker.lorem.text()),
          filename,
          mimetype: "image/jpeg",
        } as unknown as MultipartFile;

        const storeFileResult = await storeFile(multipartFile);

        equal(storeFileResult.outcome, "success");
        if (storeFileResult.outcome !== "success") {
          throw new Error("Invalid outcome");
        }

        const isFileCreated = fs.existsSync(
          path.join(CACHE_PATH, storeFileResult.file.name)
        );

        ok(isFileCreated);
      });
    });

    describe("that is not an image", () => {
      it("returns invalidFileType", async () => {
        const filename = faker.system.commonFileName();
        const multipartFile = {
          file: Readable.from(faker.lorem.text()),
          filename,
          mimetype: "application/pdf",
        } as unknown as MultipartFile;

        const { outcome } = await storeFile(multipartFile);

        equal(outcome, "invalidFileType");
      });
    });
  });
});

describe("getFileById()", () => {
  describe("given a file id", () => {
    describe("that doesn't exist", () => {
      it("returns notFound", async () => {
        const { outcome } = await getFileById(faker.string.uuid());

        equal(outcome, "notFound");
      });
    });

    describe("that exists", () => {
      it("returns the file", async () => {
        const filename = faker.system.commonFileName();
        const multipartFile = {
          file: Readable.from(faker.lorem.text()),
          filename,
          mimetype: "image/jpeg",
        } as unknown as MultipartFile;
        const storeFileResult = await storeFile(multipartFile);

        if (storeFileResult.outcome !== "success") {
          throw new Error("Invalid outcome");
        }

        const getFileByIdResult = await getFileById(storeFileResult.file.id);

        equal(getFileByIdResult.outcome, "found");
        if (getFileByIdResult.outcome !== "found") {
          throw new Error("Invalid outcome");
        }
        const { file } = getFileByIdResult;

        equal(file.mimetype, "image/jpeg");
        ok(file.stream instanceof fs.ReadStream);
      });
    });
  });
});
