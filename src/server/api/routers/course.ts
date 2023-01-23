import { TRPCError } from "@trpc/server";
import {
  courseListSchema,
  createCourseSchema,
} from "../../../schema/course.schema";
import { isValidPrice } from "../../../utils/input-validation";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const courseRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const { corporation_id } = ctx.session.user;
    const courses = await ctx.prisma.course.findMany({
      where: { corporation_id },
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
      const { course_name, course_price, course_timelimit } = input;
      const { corporation_id } = ctx.session.user;
      if (!isValidPrice(course_timelimit)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "timelimit should be a number",
        });
      }
      await ctx.prisma.course.create({
        data: {
          course_name,
          course_price,
          course_timelimit,
          corporation: { connect: { id: corporation_id } },
        },
      });
      const courses = await ctx.prisma.course.findMany({
        where: { corporation_id },
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
