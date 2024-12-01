import { describe, it, before, after } from "node:test";
import { strictEqual, match, ok } from "node:assert";
import supertest from "supertest";
import fs from "node:fs";
import path from "node:path";
import type { FastifyInstance } from "fastify";
import { getTestApp } from "../../utils/app";

const CACHE_PATH = path.join(__dirname, "../../../cache");

describe("POST /images", async () => {
  let app: FastifyInstance;

  before(async () => {
    app = await getTestApp();
  });

  after(async () => {
    await app.close();
  });

  it("should upload a file and save it correctly", async () => {
    const localFilePath = path.join(__dirname, "../__fixtures__", "damae.png");

    const response = await supertest(app.server)
      .post("/images")
      .attach("file", localFilePath);

    strictEqual(response.status, 200);

    const { name } = response.body;
    match(name, /^damae-[a-z0-9-]+\.png$/);

    const cachedFilePath = path.join(CACHE_PATH, name);
    const isFileSaved = await fs.existsSync(cachedFilePath);
    ok(isFileSaved);
  });
});
