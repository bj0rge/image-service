import type { FastifyInstance } from "fastify";
import { build } from "../../app";
import { getConfig } from "../../utils/config";

// This function should accept a mocked config if needed, but it's a PoC
export async function getTestApp(): Promise<FastifyInstance> {
  const server = await build();
  const {
    app: { host, port },
  } = getConfig();

  await server.listen({ port, host });
  return server;
}
