import * as z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { defaultErrorsSchema } from "../../utils/errors";
import { fetchAndBlur } from "../../../domain";

const queryParamsSchema = z.object({
  id: z.string(),
});
const imageUploadedSchema = z.object({});

const schema = {
  summary: "Fetch blurred image by id",
  params: queryParamsSchema,
  response: {
    200: imageUploadedSchema,
    ...defaultErrorsSchema,
  },
} as const;

export default async (app: FastifyInstance) =>
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/:id", { schema }, async (request, reply) => {
      request.log.info("Fetch image");

      const { id: fileId } = request.params;

      const fetchAndBlurResult = await fetchAndBlur(fileId);

      if (fetchAndBlurResult.outcome === "notFound") {
        request.log.error({ fileId }, "File not found");
        return reply.status(404).send({
          error: "notFound",
          message: "File not found",
          statusCode: 404,
        });
      }

      if (fetchAndBlurResult.outcome === "serverError") {
        request.log.error({ fileId }, "Error fetching file");
        return reply.status(500).send({
          error: "internalServerError",
          message: "Error fetching file",
          statusCode: 500,
        });
      }

      const { file } = fetchAndBlurResult;
      reply.type(file.mimeType);

      return reply.send(file.buffer);
    });
