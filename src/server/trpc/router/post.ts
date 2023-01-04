import { router, publicProcedure, protectedProcedure } from "../trpc";

import { z } from "zod";

export const includeFullPost = { 
    owner: true, 
    _count: { 
        select: { 
            comments: true 
        }
    }
};

export const includeFullParent = {
    parent: {
        include: includeFullPost,
    }
}

export const postRouter = router({
    get: publicProcedure
        .input(z.object({
            id: z.string(),
        }))
        .query(async ({ input, ctx}) => {
            const { id } = input;
            const result = await ctx.prisma.post.findUnique({ 
                include: includeFullPost,
                where: { id: id },
            });
            return result;
        }),
    // TODO clean up
    getMany: publicProcedure
        .input(z.object({
            createdBy: z.number().or(z.string()).optional(),
            parentID: z.string().optional(),
        }))
        .query(async ({ input, ctx}) => {
            const { createdBy, parentID } = input;
            if (typeof createdBy === "string") {
                const result = await ctx.prisma.post.findMany({ 
                    include: includeFullPost,
                    orderBy: { createdAt: "desc" },
                    where: {
                        owner: {
                            username: createdBy,
                        }
                    },
                });
                return result
            }
            if (parentID) {
                const result = await ctx.prisma.post.findMany({ 
                    include: includeFullPost,
                    orderBy: { createdAt: "desc" },
                    where: {
                        parentPostID: parentID,
                    }
                });
                return result
            }
            const result = await ctx.prisma.post.findMany({
                include: includeFullPost,
                orderBy: { createdAt: "desc" },
                where: {
                    parentPostID: null,
                },
            });
            return result;
        }),
    getReplies: publicProcedure
        .input(z.object({
            username: z.string(),
        }))
        .query(async ({ input, ctx}) => {
            const { username } = input;
            return await ctx.prisma.post.findMany({
                include: { 
                    ...includeFullPost,
                    ...includeFullParent,
                },
                orderBy: { createdAt: "desc" },
                where: {
                    owner: {
                        username: username,
                    },
                    parentPostID: {
                        not: null,
                    }
                }
            });
        }),
    getSaved: protectedProcedure
        .input(z.object({
            username: z.string(),
            liked: z.boolean().optional(),
            retweeted: z.boolean().optional(),
        }))
        .query(async ({ input, ctx }) => {
            const { username, liked, retweeted } = input;
            return await ctx.prisma.post.findMany({
                include: includeFullPost,
                orderBy: { createdAt: "desc" },
                where: {
                    savedBy: {
                        some: {
                            like: liked,
                            retweet: retweeted,
                            profile: {
                                username: username,
                            }
                        }
                    }
                }
            });
        }),
    getFeed: protectedProcedure
        .query(async ({ ctx }) => {
            const { profileID } = ctx.session.user;
            if (!profileID) return undefined;
            const result = await ctx.prisma.profile.findUnique({
                where: { id: ctx.session.user.profileID },
                select: { 
                    following: {
                        select: {
                            followingID: true,
                        }
                    }
                }
            })
            if (!result?.following || result.following.length === 0) {
                const posts = await ctx.prisma.post.findMany({
                    include: {
                        ...includeFullPost,
                        ...includeFullParent,
                    },
                    orderBy: { createdAt: "desc" },
                    take: 10,
                });
                return posts.filter(post => !posts.some(post2 => post2.parentPostID === post.id))
            }
            let posts = await ctx.prisma.post.findMany({
                include: {
                    ...includeFullPost,
                    ...includeFullParent
                },
                orderBy: { createdAt: "desc" },
                where: { 
                    owner: {
                        id: {
                            in: [...result.following.map(user => user.followingID), profileID],
                        }
                    }
                },
            })
            if (posts.length < 10) {
                const add = await ctx.prisma.post.findMany({
                    include: {
                        ...includeFullPost,
                        ...includeFullParent,
                    },
                    orderBy: { createdAt: "desc" },
                    take: 10,
                });
                posts = [...posts, ...add];
                posts = posts.sort((a, b) => a.createdAt < b.createdAt? 1 : -1);
            }
            posts = posts.filter(post => !posts.some(post2 => post2.parentPostID === post.id));
            return posts;
        }),
    create: protectedProcedure
        .input(z.object({
            content: z.string(),
            parentID: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            if (!ctx.session.user.profileID) return undefined;
            const { content, parentID } = input;
            await ctx.prisma.post.create({
                data: {
                    content: content,
                    ownerID: ctx.session.user.profileID,
                    parentPostID: parentID,
                },
            })
        }),
    delete: protectedProcedure
        .input(z.object({
            id: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            if (!ctx.session.user.isAdmin) return false;
            return !!await ctx.prisma.post.delete({
                where: {
                    id: input.id,
                }
            })
        }),
});
