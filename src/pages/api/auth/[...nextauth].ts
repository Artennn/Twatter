import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google"
import CredentialProvider from "next-auth/providers/credentials";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";

import { env } from "../../../env/server.mjs";
import type { NextApiRequest, NextApiResponse } from "next";

import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
    callbacks: {
        async jwt({ token, account, profile, user }) {
            if (token.user) {
                // check if user created a profile and apply it to the session
                if (token.user.id && !token.user.profileID) {
                    const result = await prisma.user.findUnique({
                        where: { id: token.user.id },
                        select: { profileID: true },
                    });
                    if (result?.profileID)
                        token.user.profileID = result.profileID;
                }
            }
            // apply user data to token
            if (user) {
                if (user.id && !user.profileID) {
                    const result = await prisma.user.findUnique({
                        where: { id: user.id },
                        select: { profileID: true },
                    });
                    if (result?.profileID) user.profileID = result.profileID;
                }
                token.user = {
                    id: user.id,
                    profileID: user.profileID,
                    isAdmin: user.isAdmin,
                };
            }
            return token;
        },
        session({ session, token }) {
            // apply user data stored in token to the session
            if (token.user) {
                const user = token.user;
                session.user = {
                    id: user.id,
                    profileID: user.profileID,
                    isAdmin: user.isAdmin,
                };
            }
            return session;
        },
    },
    adapter: PrismaAdapter(prisma),
    secret: env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            profile: (profile) => {
                return {
                    id: profile.sub,
                    email: profile.email,
                };
            },
        }),
        CredentialProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) return null;
                const { email, password } = credentials;

                const user = await prisma.user.findUnique({
                    where: {
                        email: email,
                    },
                });
                if (!user) return null;
                if (user.password === null) return null;

                if (!bcrypt.compareSync(password, user.password)) return null;

                // cast profileID to number | undefined from prisma type (number | null)
                // same with isAdmin
                return {
                    id: user.id,
                    profileID: user.profileID ? user.profileID : undefined,
                    isAdmin: user.isAdmin ? true : undefined,
                };
            },
        }),
    ],
};

export const handler = async (pReq: NextApiRequest, pRes: NextApiResponse) => {
    return await NextAuth(pReq, pRes, authOptions);
};
export default handler;