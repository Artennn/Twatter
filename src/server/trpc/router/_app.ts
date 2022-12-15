import { router } from "../trpc";
import { authRouter } from "./auth";
import { followsRouter } from "./follows";
import { postRouter } from "./post";
import { profileRouter } from "./profile";

export const appRouter = router({
  auth: authRouter,
  profile: profileRouter,
  follows: followsRouter,
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
