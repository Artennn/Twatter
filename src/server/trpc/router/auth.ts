import { router, publicProcedure, protectedProcedure } from "../trpc";

import { ProfileValidation } from "../../../components/auth/NewProfile";
import { LoginValidation } from "../../../components/auth/NewLoginMethod";

import bcrypt from "bcrypt";

const SALT_ROUNDS = 15;

export const authRouter = router({
    createProfile: protectedProcedure
        .input(ProfileValidation)
        .mutation(async ({ input, ctx }) => {
            const profile = await ctx.prisma.profile.create({
                data: {
                    username: input.username,
                    displayName: input.name,
                    image: input.image,
                },
            });

            if (!profile.id) return false;

            return !!(await ctx.prisma.user.update({
                where: {
                    id: ctx.session.user.id,
                },
                data: {
                    profileID: profile.id,
                },
            }));
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
