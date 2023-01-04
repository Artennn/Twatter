import { router, publicProcedure, protectedProcedure } from "../trpc";

import { AccountValidation } from "../../../components/auth/NewAccount";
import { LoginValidation } from "../../../components/auth/NewLoginMethod";

import bcrypt from "bcrypt";

const SALT_ROUNDS = 15;

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

            return !!await ctx.prisma.user.update({
                where: {
                    id: ctx.session.user.authID,
                },
                data: {
                    profileID: account.id,
                }
            });
        }),
    createLoginMethod: publicProcedure
        .input(LoginValidation)
        .mutation(async ({ input, ctx }) => {
            const { email, password, password2 } = input;
            if (password !== password2) return false;

            const hash = bcrypt.hashSync(password, SALT_ROUNDS);
            const result = !!await ctx.prisma.user.create({ 
                data: {
                    email,
                    password: hash,
                }
            });
            return result;
        }),

});
