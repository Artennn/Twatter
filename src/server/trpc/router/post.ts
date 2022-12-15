import { router, publicProcedure, protectedProcedure } from "../trpc";

import { z } from "zod";

export const postRouter = router({
    get: publicProcedure
        .input(z.object({
            id: z.string(),
        }))
        .query(async ({ input, ctx}) => {
            const { id } = input;
            const result = await ctx.prisma.post.findUnique({ 
                where: { id: id },
                include: { owner: true }
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
                    include: { owner: true },
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
                    include: { owner: true },
                    orderBy: { createdAt: "desc" },
                    where: {
                        parentPostID: parentID,
                    }
                });
                return result
            }
            const result = await ctx.prisma.post.findMany({
                include: { owner: true },
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
                include: { owner: true, 
                    parent: {
                        include: {
                            owner: true,
                        }
                    }   
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
    create: protectedProcedure
        .input(z.object({
            content: z.string(),
            parentID: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            if (!ctx.session.user.profileID) return null;
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
