import type { CourseMatch } from "../../../schema/course.schema";
import { courseMatchSchema } from "../../../schema/course.schema";
import type { CourseOnMenuList, MenuMatch } from "../../../schema/menu.schema";
import {
  courseOnMenuSchema,
  coursesOnMenusSchema,
  menuMatchSchema,
  menuType,
} from "../../../schema/menu.schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export type TCourseOnMenu = {
  courses: CourseMatch[];
  menus: MenuMatch[];
  course_on_menu: CourseOnMenuList[];
};

export const courseOnMenuRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const { corporation_id } = ctx.session.user;
    const courses = await ctx.prisma.course.findMany({
      where: { corporation_id },
    });
    const transformCourses = courses.map((course) =>
      courseMatchSchema.parse(course)
    );

    const menus = await ctx.prisma.menu.findMany({ where: { corporation_id } });
    const transformMenus = menus.map((menu) => menuMatchSchema.parse(menu));
    transformMenus.sort((left, right) => {
      const leftIndex = menuType.indexOf(left.menu_type);
      const rightIndex = menuType.indexOf(right.menu_type);
      return leftIndex - rightIndex;
    });

    const courseOnMenus = await ctx.prisma.courseOnMenu.findMany({
      where: { corporation_id },
    });
    const transformCourseOnMenu = courseOnMenus.map((val) =>
      courseOnMenuSchema.parse(val)
    );
    const result: TCourseOnMenu = {
      courses: transformCourses,
      menus: transformMenus,
      course_on_menu: transformCourseOnMenu,
    };
    return {
      status: 200,
      message: "menu get Successfully",
      result: result,
    };
  }),

  register: protectedProcedure
    .input(coursesOnMenusSchema)
    .mutation(async ({ ctx, input }) => {
      const corporation_id = ctx.session.user.corporation_id;
      ctx.prisma.$transaction(async (tx) => {
        const deleted = await tx.courseOnMenu.deleteMany({
          where: { corporation_id },
        });
        let newCreated = 0;

        if (input != null) {
          const createSchema = input.map((props) => ({
            ...props,
            corporation_id,
          }));
          const created = await tx.courseOnMenu.createMany({
            data: createSchema,
          });
          newCreated = created.count;
        }
        return {
          status: 200,
          message: "matcher updateSuccessfully",
          result: `deleted transaction ${deleted.count}, added transaction ${newCreated}`,
        };
      });
    }),
});
