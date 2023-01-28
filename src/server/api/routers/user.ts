import {
  createStaffSchema,
  createUserSchema,
} from "../../../schema/user.schema";
import { generateRandomPassword, hashPassword } from "../../../utils/password";

import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;
      const exist = await ctx.prisma.user.findFirst({
        where: { email: email.toLowerCase() },
      });
      if (exist) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "this email has already registered",
        });
      }
      const hash = await hashPassword(password);
      await ctx.prisma.user.create({
        data: {
          email,
          password: hash,
          name: email.substring(0, email.indexOf("@")),
          role: "ADMIN",
          corporation: { connect: { id: "cld8o1bwy00021lamnuj0bc0f" } },
        },
      });
      return {
        status: 201,
        message: "Account created Successfully",
        result: email,
      };
    }),

  getStaff: protectedProcedure.query(async ({ ctx }) => {
    const { corporation_id } = ctx.session.user;
    const result = await ctx.prisma.user.findMany({
      select: { id: true, name: true, email: true },
      where: { role: "STAFF", corporation_id },
    });
    if (!result) {
      return {
        status: 404,
        message: "No staff is found",
      };
    }
    return {
      status: 201,
      result,
    };
  }),

  registerStaff: protectedProcedure
    .input(createStaffSchema)
    .mutation(async ({ ctx, input }) => {
      const { corporation_id } = ctx.session.user;
      const { email } = input;
      const exist = await ctx.prisma.user.findFirst({
        where: { email: email.toLowerCase() },
      });
      if (exist) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "this email has already registered",
        });
      }
      const password = generateRandomPassword();
      const hash = await hashPassword("Password123");
      await ctx.prisma.user.create({
        data: {
          email,
          password: hash,
          name: email.substring(0, email.indexOf("@")),
          role: "STAFF",
          corporation: { connect: { id: corporation_id } },
        },
      });
      return {
        status: 201,
        message: "Staff Account created Successfully",
        result: { email, password },
      };
    }),
});
