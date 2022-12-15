import { router, publicProcedure, protectedProcedure } from "../trpc";

import { z } from "zod";

export const profileRouter = router({
    get: protectedProcedure
        .input(z.object({
            id: z.number().optional(),
            username: z.string().optional(),
        }))
        .query(async ({ input, ctx}) => {
            const { id, username } = input;
            const { profileID } = ctx.session.user;
            if (!profileID) return null;
            if (id) {
                return await ctx.prisma.profile.findUnique({ 
                    where: { 
                        id: id 
                    },
            });
            }
            if (username) {
                return await ctx.prisma.profile.findUnique({ 
                    where: { 
                        username: username 
                    },
                });
            }
            return null;
        }),
});
