import { router, protectedProcedure } from "../trpc";

import { z } from "zod";

export const followsRouter = router({
    /* getStats: publicProcedure
        .input(z.object({
            username: z.string(),
        }))
        .query(async ({ input, ctx }) => {
            return await ctx.prisma.profile.findUnique({
                where: { username: input.username },
                select: {
                    _count: {
                        select: {
                            followers: true,
                            following: true,
                        }
                    }
                }
            })
        }), */
    getFollowers: protectedProcedure
        .input(z.object({
            username: z.string(),
        }))
        .query(async ({ input, ctx }) => {
            const { profileID } = ctx.session.user;
            if (!profileID) return undefined;
            const { username } = input;
            const followers = await ctx.prisma.profile.findMany({
                where: {
                    following: {
                        some: {
                            following: {
                                username: username,
                            }
                        }
                    }
                },
                include: {
                    followers: {
                        where: {
                            followerID: profileID,
                        }
                    }
                }
            })
            return followers.map(follower => {
                const { followers, ...data } = follower;
                return {
                    ...data,
                    isFollowing: followers.length > 0,
                }
            })
        }),
    getFollowing: protectedProcedure
        .input(z.object({
            username: z.string(),
        }))
        .query(async ({ input, ctx }) => {
            const { profileID } = ctx.session.user;
            if (!profileID) return undefined;
            const { username } = input;
            const following = await ctx.prisma.profile.findMany({
                where: {
                    followers: {
                        some: {
                            follower: {
                                username: username,
                            }
                        }
                    }
                },
                include: {
                    followers: {
                        where: {
                            followerID: profileID,
                        }
                    }
                }
            })
            return following.map(follow => {
                const { followers, ...data } = follow;
                return {
                    ...data,
                    isFollowing: followers.length > 0,
                }
            })
        }),
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
    // TODO change to toggle
    follow: protectedProcedure
        .input(z.number())
        .mutation(async ({ input, ctx}) => {
            const { profileID } = ctx.session.user;
            if (!profileID) return undefined;
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
            if (!profileID) return undefined;
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
