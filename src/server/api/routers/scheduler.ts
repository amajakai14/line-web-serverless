import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const schedulerRouter = createTRPCRouter({
  expiredChannel: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(({ ctx }) => {
      console.log("update status of expired channel");
      const now = new Date();
      ctx.prisma.channel.updateMany({
        data: { status: "EXPIRED" },
        where: { time_end: { lte: now } },
      });
    }),
});
