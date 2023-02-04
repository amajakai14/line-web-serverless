import { TRPCError } from "@trpc/server";
import {
  createTableSchema,
  getTableSchema,
} from "../../../schema/table.schema";
import { isValidTableName } from "../../../utils/input-validation";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const deskRouter = createTRPCRouter({
  register: protectedProcedure
    .input(createTableSchema)
    .mutation(async ({ ctx, input }) => {
      const { table_name } = input;
      const { corporation_id } = ctx.session.user;
      if (!isValidTableName(table_name)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "table name only contain alphabet, number, -, or _",
        });
      }
      await ctx.prisma.desk.create({
        data: {
          table_name,
          is_occupied: false,
          corporation: { connect: { id: corporation_id } },
        },
      });
    }),

  getTables: protectedProcedure.query(async ({ ctx }) => {
    const { corporation_id } = ctx.session.user;
    const result = await ctx.prisma.desk.findMany({
      where: { corporation_id },
      select: { id: true, table_name: true, is_occupied: true },
      orderBy: { id: "asc" },
    });
    return {
      status: 201,
      result,
    };
  }),

  getTable: protectedProcedure
    .input(getTableSchema)
    .query(async ({ ctx, input }) => {
      const { table_id } = input;
      const { corporation_id } = ctx.session.user;
      const today = new Date();
      const todayAtMidNight = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0,
        0
      );
      const result = await ctx.prisma.channel.findMany({
        select: {
          id: true,
          status: true,
          time_start: true,
          time_end: true,
        },
        where: { table_id, time_start: { gte: todayAtMidNight } },
      });
      return {
        status: 201,
        result,
      };
    }),
});
