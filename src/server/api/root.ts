import { courseRouter } from "./routers/course";
import { exampleRouter } from "./routers/example";
import { menuRouter } from "./routers/menu";
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
});

// export type definition of API
export type AppRouter = typeof appRouter;
