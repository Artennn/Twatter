import { router, publicProcedure, protectedProcedure } from "../trpc";

import { z } from "zod";

export const followsRouter = router({
    isFollowing: protectedProcedure
        .input(z.object({
            username: z.string(),
        }))
        .query(async ({ input, ctx}) => {
            if (!ctx.session.user.profileID) return undefined;
            const { username } = input;

            return !!await ctx.prisma.follows.findFirst({
                where: {
                    followerID: ctx.session.user.profileID,
                    following: {
                        username: username,
                    }
                }
            })
        }),
    follow: protectedProcedure
        .input(z.number())
        .mutation(async ({ input, ctx}) => {
            const { profileID } = ctx.session.user;
            if (!profileID) return null;
            return !!await ctx.prisma.follows.create({
                data: {
                    followerID: profileID,
                    followingID: input,
                }
            })
        }),
    unFollow: protectedProcedure
        .input(z.number())
        .mutation(async ({ input, ctx}) => {
            const { profileID } = ctx.session.user;
            if (!profileID) return null;
            return !!await ctx.prisma.follows.delete({
                where: {
                    followerID_followingID: {
                        followerID: profileID,
                        followingID: input,
                    }
                }
            })
        }),
});
