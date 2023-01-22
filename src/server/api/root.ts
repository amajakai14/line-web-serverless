import { channelRouter } from "./routers/channel";
import { courseRouter } from "./routers/course";
import { courseOnMenuRouter } from "./routers/course-on-menu";
import { exampleRouter } from "./routers/example";
import { menuRouter } from "./routers/menu";
import { schedulerRouter } from "./routers/scheduler";
import { tableRouter } from "./routers/table";
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
  table: tableRouter,
  channel: channelRouter,
  scheduler: schedulerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
