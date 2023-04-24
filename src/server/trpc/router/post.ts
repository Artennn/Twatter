import { router, publicProcedure, protectedProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export const includeFullPost = Prisma.validator<Prisma.PostInclude>()({
    owner: true, 
    _count: { 
        select: { 
            comments: true 
        }
    },
});

export const includeFullParent = Prisma.validator<Prisma.PostInclude>()({
    parent: {
        include: includeFullPost,
    }
});

type FullPost = Prisma.PostGetPayload<{
    include: typeof includeFullPost,
}>;

type FullParent = Prisma.PostGetPayload<{
    include: typeof includeFullParent,
}>;

type FullPostWithParent = FullPost & FullParent;

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
            let posts: FullPostWithParent[] = [];
            // get posts made by followed profiles
            const follows = await ctx.prisma.profile.findUnique({
                where: { id: ctx.session.user.profileID },
                select: { 
                    following: {
                        select: {
                            followingID: true,
                        }
                    }
                }
            })
            if (follows?.following) {
                const add = await ctx.prisma.post.findMany({
                    include: {
                        ...includeFullPost,
                        ...includeFullParent
                    },
                    orderBy: { createdAt: "desc" },
                    where: { 
                        owner: {
                            id: {
                                in: [...follows.following.map(user => user.followingID), profileID],
                            }
                        }
                    },
                })
                posts = add;
            }
            // add extra posts
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
            }
            // remove posts that are included by their replies
            posts = posts.filter(post => !posts.some(post2 => post2.parentPostID === post.id));
            // remove duplicate posts
            posts = posts.filter((post, key, self) => key === self.findIndex(x => x.id === post.id));
            // remove duplicate replies
            posts = posts.filter((post, key, self) => key === self.findIndex(x => x.parentPostID === post.parentPostID));
            // sort posts
            posts = posts.sort((a, b) => a.createdAt < b.createdAt? 1 : -1);
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
