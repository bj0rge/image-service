import { describe, it } from "node:test";
import { deepEqual } from "node:assert";
import { faker } from "@faker-js/faker";
import { buildDatabase } from "../in-memory-database";
import type { ImageMimetype } from "../../domain";

describe("inMemoryDatabase", () => {
  describe("saveFile()", () => {
    const database = buildDatabase();
    it("should store the file for a given id", () => {
      const id = faker.string.uuid();
      const name = faker.system.fileName();
      const mimetype = faker.system.mimeType() as ImageMimetype;
      database.saveFile({ id, name, mimetype });
      deepEqual(database.__testOnly__.fileInfoById.get(id)?.name, name);
    });
  });
});
