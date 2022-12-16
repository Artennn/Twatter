import { router, publicProcedure, protectedProcedure } from "../trpc";

import { z } from "zod";

export const savedPostRouter = router({
    getByPost: protectedProcedure
        .input(z.string())
        .query(async ({ input, ctx }) => {
            if (!ctx.session.user.profileID) return undefined;
            return await ctx.prisma.savedPost.findUnique({
                where: {
                    profileID_postID: {
                        profileID: ctx.session.user.profileID,
                        postID: input,
                    }
                }
            })
        }),
    set: protectedProcedure
        .input(z.object({
            postID: z.string(),
            like: z.boolean().optional(),
            retweet: z.boolean().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            if (!ctx.session.user.profileID) return undefined;
            const { postID, like, retweet } = input;
            const selectPost = {
                profileID_postID: {
                    profileID: ctx.session.user.profileID,
                    postID: postID,
                },
            };
            const createPost = {
                profileID: ctx.session.user.profileID,
                postID: postID,
            }

            if (like !== undefined) {
                if (like) {
                    await ctx.prisma.savedPost.upsert({
                        where: selectPost,
                        update: { like: true },
                        create: { ...createPost, like: true }
                    })
                    await ctx.prisma.post.update({
                        where: { id: postID },
                        data: { likes: { increment: 1 } }
                    });
                } else {
                    await ctx.prisma.savedPost.update({
                        where: selectPost,
                        data: { like: false },
                    })
                    await ctx.prisma.post.update({
                        where: { id: postID },
                        data: { likes: { decrement: 1 }},
                    })
                }
            }

            if (retweet !== undefined) {
                if (retweet) {
                    await ctx.prisma.savedPost.upsert({
                        where: selectPost,
                        update: { retweet: true },
                        create: { ...createPost, retweet: true }
                    })
                    await ctx.prisma.post.update({
                        where: { id: postID },
                        data: { retweets: { increment: 1 } }
                    });
                } else {
                    await ctx.prisma.savedPost.update({
                        where: selectPost,
                        data: { retweet: false },
                    });
                    
                    await ctx.prisma.post.update({
                        where: { id: postID },
                        data: { retweets: { decrement: 1 }},
                    });
                }
            }

            /*
            if (like === false && retweet === false) {
                return !!await ctx.prisma.savedPost.delete({
                    where: {
                        profileID_postID: {
                            profileID: ctx.session.user.profileID,
                            postID: postID,
                        },
                    }
                })
            }
            console.log({like, retweet});
            return !!await ctx.prisma.savedPost.upsert({
                where: {
                    profileID_postID: {
                        profileID: ctx.session.user.profileID,
                        postID: postID,
                    }
                }, 
                update: {
                    like: like,
                    retweet: retweet,
                },
                create: {
                    profileID: ctx.session.user.profileID,
                    postID: postID,
                    like: like,
                    retweet: retweet,
                }
            })
            */
        }),
});
