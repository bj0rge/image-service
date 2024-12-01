import { it, describe } from "node:test";
import { equal } from "node:assert";
import { faker } from "@faker-js/faker";
import { generateUniqueFilename, isMimetypeAnImage } from "../utils";

describe("generateUniqueFilename()", () => {
  describe("given a filename without an extension", () => {
    it("should return a filename with a UUID and no extension", () => {
      const filename = faker.string.alpha();
      const id = faker.string.uuid();
      const result = generateUniqueFilename(filename, id);
      equal(result, `${filename}-${id}`);
    });
  });

  describe("given a filename with an extension", () => {
    it("should return a filename with a UUID before the extension", () => {
      const extension = faker.system.commonFileExt();
      const filename = faker.string.alpha();
      const id = faker.string.uuid();
      const result = generateUniqueFilename(`${filename}.${extension}`, id);
      equal(result, `${filename}-${id}.${extension}`);
    });
  });

  describe("given a filename with multiple dots", () => {
    it("should return a filename with a UUID before the extension", () => {
      const extension = faker.system.commonFileExt();
      const filename = `${faker.string.alpha()}.${faker.string.alpha()}`;
      const id = faker.string.uuid();
      const result = generateUniqueFilename(`${filename}.${extension}`, id);
      equal(result, `${filename}-${id}.${extension}`);
    });
  });
});

describe("isMimetypeAnImage", () => {
  it("should return true for image/png", () => {
    equal(isMimetypeAnImage("image/png"), true);
  });

  it("should return true for image/jpeg", () => {
    equal(isMimetypeAnImage("image/jpeg"), true);
  });

  it("should return false for text/plain", () => {
    equal(isMimetypeAnImage("text/plain"), false);
  });
});
