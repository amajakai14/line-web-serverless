import { TRPCError } from "@trpc/server";
import { createMenuSchema, menuListSchema } from "../../../schema/menu.schema";
import { isValidPrice } from "../../../utils/input-validation";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const menuRouter = createTRPCRouter({
  register: protectedProcedure
    .input(createMenuSchema)
    .mutation(async ({ ctx, input }) => {
      const { menu_name, menu_type, price } = input;
      const { id } = ctx.session.user;
      if (!isValidPrice(price)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "price should be a number",
        });
      }
      await ctx.prisma.menu.create({
        data: {
          menu_name,
          menu_type,
          price,
          user: { connect: { id } },
        },
      });
      const menus = await ctx.prisma.menu.findMany({ where: { user_id: id } });
      if (menus == null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "unable to get any of menulist",
        });
      }
      const transform = menus.map((menu) => menuListSchema.parse(menu));
      return {
        status: 201,
        message: "menu created Successfully",
        result: transform,
      };
    }),
});