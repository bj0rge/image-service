import * as z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { defaultErrorsSchema } from "../../utils/errors";
import { getFileById } from "../../../domain";

const queryParamsSchema = z.object({
  id: z.string(),
});
const imageUploadedSchema = z.object({});

const schema = {
  summary: "Fetch image by id",
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
      const getFileByIdResult = await getFileById(fileId);
      if (getFileByIdResult.outcome === "notFound") {
        request.log.error({ fileId }, "File not found");
        return reply.status(404).send({
          error: "notFound",
          message: "File not found",
          statusCode: 404,
        });
      }

      const { file } = getFileByIdResult;

      return reply.type(file.mimetype).send(file.stream);
    });
