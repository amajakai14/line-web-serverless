import z from "zod";
import { menuType } from "../server/api/service/menu.service";

export const menuListSchema = z.object({
  id: z.number(),
  menu_name: z.string(),
  menu_type: z.enum(menuType),
  price: z.number().nonnegative(),
  available: z.boolean(),
  url: z.string().url().optional(),
});

export type MenuList = z.TypeOf<typeof menuListSchema>;

export const menuMatchSchema = menuListSchema.pick({
  id: true,
  menu_name: true,
  menu_type: true,
});

export type MenuMatch = z.TypeOf<typeof menuMatchSchema>;

export const courseOnMenuSchema = z.object({
  menu_id: z.number(),
  course_id: z.number(),
});

export type CourseOnMenuList = z.TypeOf<typeof courseOnMenuSchema>;

export const coursesOnMenusSchema = z.array(courseOnMenuSchema).nullish();
export type CoursesOnMenus = z.TypeOf<typeof coursesOnMenusSchema>;

export const uploadImageSchema = z.object({
  id: z.number(),
});
export type UploadImageInput = z.TypeOf<typeof uploadImageSchema>;
