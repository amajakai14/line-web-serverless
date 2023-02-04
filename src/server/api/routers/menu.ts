import { TRPCError } from "@trpc/server";
import { env } from "../../../env/server.mjs";
import {
  createMenuSchema,
  menuListSchema,
  uploadImageSchema,
} from "../../../schema/menu.schema";
import { isValidPrice } from "../../../utils/input-validation";
import { putObjectPresignedUrl } from "../../s3";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const menuRouter = createTRPCRouter({
  register: protectedProcedure
    .input(createMenuSchema)
    .mutation(async ({ ctx, input }) => {
      const { menu_name, menu_type, price, upload_file } = input;
      const { corporation_id } = ctx.session.user;
      if (!isValidPrice(price)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "price should be a number",
        });
      }
      const result = await ctx.prisma.menu.create({
        data: {
          menu_name,
          menu_type,
          price,
          corporation: { connect: { id: corporation_id } },
          hasImage: upload_file,
        },
      });
      if (result == null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "unable to create menu",
        });
      }
      if (!input.upload_file) return;

      return await putObjectPresignedUrl(corporation_id, result.id);
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
      return await putObjectPresignedUrl(corporation_id, id);
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
