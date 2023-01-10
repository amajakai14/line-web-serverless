import bcrypt from "bcrypt";
import { createUserSchema } from "../../../schema/user.schema";

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
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
      await ctx.prisma.user.create({
        data: {
          email,
          password: hash,
          name: email.substring(0, email.indexOf("@")),
          role: "ADMIN",
          corporation: { connect: { id: "clcq4gc7y000008l7adv478ub" } },
        },
      });
      return {
        status: 201,
        message: "Account created Successfully",
        result: email,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
