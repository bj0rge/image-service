import { describe, it } from "node:test";
import { deepEqual } from "node:assert";
import { faker } from "@faker-js/faker";
import { buildDatabase } from "../in-memory-database";

describe("inMemoryDatabase", () => {
  describe("saveFile()", () => {
    const database = buildDatabase();
    it("should store the file for a given id", () => {
      const id = faker.string.uuid();
      const name = faker.system.fileName();
      database.saveFile({ id, name });
      deepEqual(database.__testOnly__.fileNamesById.get(id), name);
    });
  });
});
