import { describe, it, before, after } from "node:test";
import { strictEqual } from "node:assert";
import supertest from "supertest";
import path from "node:path";
import type { FastifyInstance } from "fastify";
import { faker } from "@faker-js/faker";
import { getTestApp } from "../../utils/app";

describe("GET /images/:id", async () => {
  let app: FastifyInstance;

  before(async () => {
    app = await getTestApp();
  });

  after(async () => {
    await app.close();
  });

  describe("given a file that exists", () => {
    let fileId: string;

    before(async () => {
      const localFilePath = path.join(
        __dirname,
        "../__fixtures__",
        "damae.png"
      );

      const response = await supertest(app.server)
        .post("/images")
        .attach("file", localFilePath);

      fileId = response.body.id;
    });

    it("should return the file", async () => {
      const response = await supertest(app.server).get(`/images/${fileId}`);

      strictEqual(response.status, 200);
      strictEqual(response.headers["content-type"], "image/png");
    });
  });

  describe("given a file that does not exist", () => {
    it("should return 404", async () => {
      const response = await supertest(app.server).get(
        `/images/${faker.string.uuid()}`
      );

      strictEqual(response.status, 404);
    });
  });
});
