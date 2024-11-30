import z from "zod";

export const configSchema = z.object({
  env: z.union([
    z.literal("development"),
    z.literal("test"),
    z.literal("production"),
  ]),
  app: z
    .object({
      host: z.string(),
      port: z.number(),
    })
    .strict(),
});

export type Config = z.infer<typeof configSchema>;
