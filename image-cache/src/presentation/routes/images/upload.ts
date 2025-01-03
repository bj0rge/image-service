import * as z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { defaultErrorsSchema } from "../../utils/errors";
import { storeFile } from "../../../domain";

const imageUploadedSchema = z.object({ id: z.string(), name: z.string() });

const schema = {
  summary: "Upload image",
  response: {
    200: imageUploadedSchema,
    415: z.object({
      error: z.literal("invalidFileType"),
      message: z.literal("Please upload a JPEG or PNG image"),
      statusCode: z.literal(415),
      detail: z.unknown(),
    }),
    ...defaultErrorsSchema,
  },
} as const;

export default async (app: FastifyInstance) =>
  app
    .withTypeProvider<ZodTypeProvider>()
    .post("/", { schema }, async (request, reply) => {
      request.log.info("Upload image");

      const data = await request.file();
      if (!data) {
        request.log.error("No file uploaded");
        return reply.status(400).send({
          error: "invalidFile",
          message: "Please upload a file",
          statusCode: 400,
        });
      }

      const storedFileResult = await storeFile(data);

      if (storedFileResult.outcome === "invalidFileType") {
        request.log.error({ mimetype: data.mimetype }, "Invalid file type");
        return reply.status(415).send({
          error: "invalidFileType",
          message: "Please upload a JPEG or PNG image",
          statusCode: 415,
          detail: storedFileResult.details,
        });
      }

      request.log.info({ file: storedFileResult.file }, "File uploaded");

      return reply.status(200).send(storedFileResult.file);
    });
