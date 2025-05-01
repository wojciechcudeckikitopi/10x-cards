import { z } from "zod";

export const QueryParamsSchema = z.object({
  page: z.coerce.number().int().min(0).optional().default(0),
  limit: z.coerce.number().int().min(1).optional().default(10),
});
