import z from "zod";

export const getTableSchema = z.object({
  table_id: z.number(),
});
export type getTableInput = z.TypeOf<typeof getTableSchema>;

export const createTableSchema = z.object({
  table_name: z.string(),
});
export type CreateTableInput = z.TypeOf<typeof createTableSchema>;

export const tableListSchema = z.object({
  id: z.number(),
  table_name: z.string(),
  available: z.boolean(),
});
export type MenuList = z.TypeOf<typeof tableListSchema>;
