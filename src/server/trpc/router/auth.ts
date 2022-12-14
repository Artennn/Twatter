import { router, publicProcedure, protectedProcedure } from "../trpc";

import { AccountValidation } from "../../../components/auth/NewAccount";
import { LoginValidation } from "../../../components/auth/NewLoginMethod";

export const authRouter = router({
    createAccount: protectedProcedure
        .input(AccountValidation)
        .mutation(async ({ input, ctx }) => {
            const account = await ctx.prisma.profile.create({
                data: {
                    username: input.username,
                    displayName: input.name,
                    image: input.image,
                }
            });

            if (!account.id) return false;

            await ctx.prisma.user.update({
                where: {
                    id: ctx.session.user.authID,
                },
                data: {
                    profileID: account.id,
                }
            })
            return true;
        }),
    createLoginMethod: publicProcedure
        .input(LoginValidation)
        .mutation(async ({ input, ctx }) => {
            // TODO bcrypt
            const { email, password, password2 } = input;
            await ctx.prisma.user.create({ 
                data: {
                    email,
                    password,
                }
            });
        }),

});
