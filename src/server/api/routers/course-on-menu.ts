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
    const { id } = ctx.session.user;
    const courses = await ctx.prisma.course.findMany({
      where: { user_id: id },
    });
    const transformCourses = courses.map((course) =>
      courseMatchSchema.parse(course)
    );

    const menus = await ctx.prisma.menu.findMany({ where: { user_id: id } });
    const transformMenus = menus.map((menu) => menuMatchSchema.parse(menu));
    const sortedMenus = transformMenus.sort((a, b) => {
      const aIndex = menuType.indexOf(a.menu_type);
      const bIndex = menuType.indexOf(b.menu_type);
      return aIndex - bIndex;
    });

    const courseOnMenus = await ctx.prisma.courseOnMenu.findMany({
      where: { user_id: id },
    });
    const transformCourseOnMenu = courseOnMenus.map((val) =>
      courseOnMenuSchema.parse(val)
    );
    const result: TCourseOnMenu = {
      courses: transformCourses,
      menus: sortedMenus,
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
      const user_id = ctx.session.user.id;
      ctx.prisma.$transaction(async (tx) => {
        const deleted = await tx.courseOnMenu.deleteMany({
          where: { user_id },
        });
        let newCreated = 0;

        if (input != null) {
          const createSchema = input.map((props) => ({
            ...props,
            user_id,
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
