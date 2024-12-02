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
  dependencies: z.object({
    imageCacheService: z.object({
      baseUrl: z.string(),
    }),
  }),
  libraries: z.object({
    blur: z.object({
      defaultRadius: z.number(),
    }),
  }),
});

export type Config = z.infer<typeof configSchema>;
