import { TRPCError } from "@trpc/server";
import {
  courseListSchema,
  createCourseSchema,
} from "../../../schema/course.schema";
import { isValidPrice } from "../../../utils/input-validation";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const courseRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const { id } = ctx.session.user;
    const courses = await ctx.prisma.course.findMany({
      where: { user_id: id },
    });
    const transform = courses.map((course) => courseListSchema.parse(course));
    return {
      status: 200,
      message: "menu get Successfully",
      result: transform,
    };
  }),

  register: protectedProcedure
    .input(createCourseSchema)
    .mutation(async ({ ctx, input }) => {
      const { course_name, course_timelimit } = input;
      const { id } = ctx.session.user;
      if (!isValidPrice(course_timelimit)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "timelimit should be a number",
        });
      }
      await ctx.prisma.course.create({
        data: {
          course_name,
          course_timelimit,
          user: { connect: { id } },
        },
      });
      const courses = await ctx.prisma.course.findMany({
        where: { user_id: id },
      });
      if (courses == null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "unable to get any of courselist",
        });
      }
      const transform = courses.map((course) => courseListSchema.parse(course));
      return {
        status: 201,
        message: "menu created Successfully",
        result: transform,
      };
    }),
});
