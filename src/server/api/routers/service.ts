import { env } from "../../../env/server.mjs";
import { getServiceSchema } from "../../../schema/service.schema";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const serviceRouter = createTRPCRouter({
  get: publicProcedure.input(getServiceSchema).query(async ({ ctx, input }) => {
    const { corporation_id, channel_id } = input;
    const channel = await ctx.prisma.channel.findFirst({
      where: { id: channel_id },
    });
    if (!channel) return null;
    const course = await ctx.prisma.course.findFirst({
      where: { course_name: channel.course_name },
    });
    if (!course) return null;

    const x = await ctx.prisma.menu.findMany({
      where: { corporation_id },
      include: {
        course_on_menu: {
          where: { course_id: course.id },
          select: {
            menu_id: true,
          },
        },
      },
    });
    //fileter x that doesn't have menu_id in course_on_menu
    const menus = x.filter((menu) => {
      return menu.course_on_menu.length > 0;
    });

    // const courseOnMenu = await ctx.prisma.courseOnMenu.findMany({
    //   where: { course_id: course.id },
    // });
    // const menu_id_list = courseOnMenu.map(
    //   (courseOnMenu) => courseOnMenu.menu_id
    // );
    // const menus = await ctx.prisma.menu.findMany({
    //   where: { id: { in: menu_id_list } },
    // });

    const transform = menus.map((menu) => {
      if (!menu.hasImage) return menu;
      const url = env.CLOUDFRONT_URL + corporation_id + "/" + menu.id;
      return {
        ...menu,
        url,
      };
    });
    return transform;
  }),
});
