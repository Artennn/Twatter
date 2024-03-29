import { router, protectedProcedure } from "../trpc";

import { z } from "zod";
import { EditProfileValidation } from "components/dialogs/EditProfile";

const includeProfileStats = {
    _count: {
        select: {
            followers: true,
            following: true,
        }
    }
}

export const profileRouter = router({
    get: protectedProcedure
        .input(z.object({
            id: z.number().optional(),
            username: z.string().optional(),
        }))
        .query(async ({ input, ctx}) => {
            const { id, username } = input;
            const { profileID } = ctx.session.user;
            if (!profileID) return undefined;
            if (id) {
                return await ctx.prisma.profile.findUnique({
                    include: includeProfileStats,
                    where: { 
                        id: id 
                    },
            });
            }
            if (username) {
                return await ctx.prisma.profile.findUnique({ 
                    include: includeProfileStats,
                    where: { 
                        username: username 
                    },
                });
            }
            return undefined;
        }),
    getMany: protectedProcedure
        .input(
            z.object({
                ids: z.array(z.number()).optional(),
                usernames: z.array(z.string()).optional(),
            })
        )
        .query(async ({ input, ctx }) => {
            const { profileID } = ctx.session.user;
            if (!profileID) return undefined;

            const { ids, usernames } = input;
            return await ctx.prisma.profile.findMany({
                include: {
                    followers: {
                        where: {
                            followerID: profileID,
                        }
                    }
                },
                where: {
                    id: {
                        in: ids,
                    },
                    username: {
                        in: usernames,
                    },
                },
            });
        }),
    findMany: protectedProcedure
        .input(z.string())
        .query(async ({ input, ctx }) => {
            const { profileID } = ctx.session.user;
            if (!profileID) return undefined;

            return await ctx.prisma.profile.findMany({
                include: {
                    followers: {
                        where: {
                            followerID: profileID,
                        }
                    }
                },
                where: {
                    username: {
                        contains: input,
                    },
                },
            });
        }),
    edit: protectedProcedure
        .input(EditProfileValidation)
        .mutation(async ({ input, ctx }) => {
            const { profileID } = ctx.session.user;
            if (!profileID) return false;
            const { displayName, image, description, background } = input; 
            return !!await ctx.prisma.profile.update({
                where: { id: profileID },
                data: {
                    displayName,
                    image,
                    background,
                    description,
                }
            })
        }),
});
