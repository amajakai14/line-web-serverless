import { TRPCError } from "@trpc/server";
import { env } from "../../../env/server.mjs";
import { menuListSchema, uploadImageSchema } from "../../../schema/menu.schema";
import { isValidPrice } from "../../../utils/input-validation";
import {
  addMenu,
  createMenuSchema,
  uploadMenuImage,
} from "../service/menu.service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const menuRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createMenuSchema)
    .mutation(async ({ ctx, input }) => {
      const { price } = input;
      const { corporation_id } = ctx.session.user;
      if (!isValidPrice(price)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "price should be a number",
        });
      }
      const menu = await addMenu(ctx.prisma, input, corporation_id);
      if (!input.hasImage) return;

      return await uploadMenuImage(corporation_id, menu.id);
    }),

  uploadImage: protectedProcedure
    .input(uploadImageSchema)
    .mutation(async ({ ctx, input }) => {
      const { corporation_id } = ctx.session.user;
      const { id } = input;
      await ctx.prisma.menu.update({
        where: { id },
        data: { hasImage: true },
      });
      return await uploadMenuImage(corporation_id, id);
    }),

  get: protectedProcedure.query(async ({ ctx }) => {
    const { corporation_id } = ctx.session.user;
    const menus = await ctx.prisma.menu.findMany({
      where: { corporation_id },
      orderBy: { id: "asc" },
    });
    if (menus == null) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "unable to get any of menulist",
      });
    }
    const transform = menus.map((menu) => {
      if (!menu.hasImage) return menu;
      const url = env.CLOUDFRONT_URL + corporation_id + "/" + menu.id;
      return {
        ...menu,
        url,
      };
    });

    return transform.map((menu) => menuListSchema.parse(menu));
  }),
});
