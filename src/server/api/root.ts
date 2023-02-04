import { channelRouter } from "./routers/channel";
import { courseRouter } from "./routers/course";
import { courseOnMenuRouter } from "./routers/course-on-menu";
import { deskRouter } from "./routers/desk";
import { exampleRouter } from "./routers/example";
import { menuRouter } from "./routers/menu";
import { schedulerRouter } from "./routers/scheduler";
import { serviceRouter } from "./routers/service";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
  menu: menuRouter,
  course: courseRouter,
  courseOnMenu: courseOnMenuRouter,
  desk: deskRouter,
  channel: channelRouter,
  scheduler: schedulerRouter,
  service: serviceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
