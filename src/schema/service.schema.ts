import z from "zod";

export const getServiceSchema = z.object({
  corporation_id: z.string(),
  channel_id: z.string(),
});

export type CreateCourseInput = z.TypeOf<typeof getServiceSchema>;
