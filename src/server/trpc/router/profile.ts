import { router, publicProcedure, protectedProcedure } from "../trpc";

import { z } from "zod";

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
});
