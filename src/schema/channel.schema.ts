import z from "zod";

export const createChannelSchema = z.object({
  table_id: z.number(),
  course_id: z.number(),
});
export type CreateChannelInput = z.TypeOf<typeof createChannelSchema>;

export const updateChannelSchema = z.object({
  channel_id: z.string(),
  status: z.string(),
});
export type UpdateChannelInput = z.TypeOf<typeof updateChannelSchema>;

export const getActiveChannelSchema = z.object({
  table_id: z.number(),
});
export type ActiveChannel = z.TypeOf<typeof getActiveChannelSchema>;
