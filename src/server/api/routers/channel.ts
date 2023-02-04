import { TRPCError } from "@trpc/server";
import * as crypto from "crypto";
import z from "zod";
import {
  createChannelSchema,
  updateChannelSchema,
} from "../../../schema/channel.schema";
import { getTableSchema } from "../../../schema/table.schema";
import { addMinutes } from "../../../utils/add-minutes";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const channelRouter = createTRPCRouter({
  register: protectedProcedure
    .input(createChannelSchema)
    .mutation(async ({ ctx, input }) => {
      const { table_id, course_id } = input;
      const isOccupied = await ctx.prisma.desk.findFirst({
        where: { id: table_id, is_occupied: true },
      });
      if (isOccupied) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "table has been occupied",
        });
      }
      let id = crypto.randomUUID();
      while (true) {
        const foundOne = await ctx.prisma.channel.findUnique({ where: { id } });
        if (!foundOne) break;
        id = crypto.randomUUID();
      }
      const course = await ctx.prisma.course.findUnique({
        select: { id: true, course_name: true, course_timelimit: true },
        where: { id: course_id },
      });
      if (!course) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Course not found",
        });
      }
      const time_start = new Date();
      const defaultTime = 90;
      const timelimit = course.course_timelimit;
      const time_end =
        timelimit == null
          ? addMinutes(time_start, defaultTime)
          : addMinutes(time_start, timelimit);

      await ctx.prisma.$transaction([
        ctx.prisma.channel.create({
          data: {
            id,
            table_id,
            course_name: course.course_name,
            user_id: 1,
            status: "ONLINE",
            time_start,
            time_end,
          },
        }),
        ctx.prisma.desk.update({
          where: { id: table_id },
          data: { is_occupied: true },
        }),
      ]);

      return {
        status: 201,
      };
    }),

  updateChannel: protectedProcedure
    .input(updateChannelSchema)
    .mutation(async ({ ctx, input }) => {
      const { channel_id, status } = input;
      const result = await ctx.prisma.channel.update({
        where: { id: channel_id },
        data: { id: channel_id, status },
      });
      return {
        status: 201,
        result,
      };
    }),

  getChannels: protectedProcedure
    .input(getTableSchema)
    .query(async ({ ctx, input }) => {
      const { table_id } = input;
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

  getChannel: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.channel.findFirst({
        where: { id: input },
      });
      if (!result) {
        return {
          status: 404,
        };
      }
      return {
        status: 200,
        result,
      };
    }),
});
