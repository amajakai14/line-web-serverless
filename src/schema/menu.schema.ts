import z from "zod";

export const menuType = ["MAIN", "DRINK", "DESSERT", "APPETIZER"] as const;

export const createMenuSchema = z.object({
  menu_name: z.string(),
  menu_type: z.enum(menuType),
  price: z.number().nonnegative(),
});

export type CreateMenuInput = z.TypeOf<typeof createMenuSchema>;

export const menuListSchema = z.object({
  id: z.number(),
  menu_name: z.string(),
  menu_type: z.enum(menuType),
  price: z.number().nonnegative(),
  available: z.boolean(),
});

export type MenuList = z.TypeOf<typeof menuListSchema>;
