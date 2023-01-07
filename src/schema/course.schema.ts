import z from "zod";

export const createCourseSchema = z.object({
  course_name: z.string(),
  course_timelimit: z.number().nonnegative(),
});

export type CreateCourseInput = z.TypeOf<typeof createCourseSchema>;

export const courseListSchema = z.object({
  id: z.number(),
  course_name: z.string(),
  course_timelimit: z.number().nonnegative(),
});

export type CourseList = z.TypeOf<typeof courseListSchema>;
