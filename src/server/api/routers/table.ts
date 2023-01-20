import { TRPCError } from "@trpc/server";
import { createTableSchema } from "../../../schema/table.schema";
import { isValidTableName } from "../../../utils/input-validation";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const tableRouter = createTRPCRouter({
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
      await ctx.prisma.table.create({
        data: {
          table_name,
          is_occupied: false,
          corporation: { connect: { id: corporation_id } },
        },
      });
    }),

  getTables: protectedProcedure.query(async ({ ctx }) => {
    const { corporation_id } = ctx.session.user;
    const result = await ctx.prisma.table.findMany({
      where: { corporation_id },
      select: { id: true, table_name: true, is_occupied: true },
    });
    return {
      status: 201,
      result,
    };
  }),
});
