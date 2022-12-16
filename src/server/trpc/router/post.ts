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
            if (!result?.following) return [];
            return await ctx.prisma.post.findMany({
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
        })
});
