import { router } from "../trpc";
import { authRouter } from "./auth";
import { feedRouter } from "./feed";
import { followsRouter } from "./follows";
import { postRouter } from "./post";
import { profileRouter } from "./profile";
import { savedPostRouter } from "./savedPost";

export const appRouter = router({
  auth: authRouter,
  profile: profileRouter,
  follows: followsRouter,
  post: postRouter,
  savedPost: savedPostRouter,
  feed: feedRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
