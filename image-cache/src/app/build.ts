import Fastify, {
  type FastifyInstance,
  type FastifyServerOptions,
} from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { getConfig } from "../utils/config";
import { plugins } from "../presentation";

const prettyLoggerOptions: FastifyServerOptions["logger"] = {
  transport: {
    target: "pino-pretty",
    options: {
      translateTime: "HH:MM:ss Z",
      ignore: "pid,hostname",
    },
  },
};

const envToLogger: {
  development: FastifyServerOptions["logger"];
  production: FastifyServerOptions["logger"];
  test: FastifyServerOptions["logger"];
} = {
  development: prettyLoggerOptions,
  production: prettyLoggerOptions,
  test: false,
};

export async function build(): Promise<FastifyInstance> {
  const { env } = getConfig();

  const app = Fastify({ logger: envToLogger[env] ?? true });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(plugins);

  return app.withTypeProvider<ZodTypeProvider>();
}
