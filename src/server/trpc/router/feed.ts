import { router, protectedProcedure } from "../trpc";
import { includeFullParent, includeFullPost } from "./post";

export const feedRouter = router({
    get: protectedProcedure
        .query(async ({ ctx }) => {
            if (!ctx.session.user.profileID) return undefined;
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
                where: { 
                    owner: {
                        id: {
                            in: result.following.map(user => user.followingID),
                        }
                    }
                },
            })
        }),
});
