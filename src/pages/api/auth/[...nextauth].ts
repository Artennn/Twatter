import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google"
import CredentialProvider from "next-auth/providers/credentials";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";

import { env } from "../../../env/server.mjs";
import { NextApiRequest, NextApiResponse } from "next";
import { decode, encode } from "next-auth/jwt";

import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import Cookies from "cookies";

const CREDENTIALS_SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const handler = async (pReq: NextApiRequest, pRes: NextApiResponse) => {
    const [req, res, options] = requestWrapper(pReq, pRes);
    return await NextAuth(req, res, options);
};
export default handler;

const checkIfCredentials = (req: NextApiRequest) => 
    req.query.nextauth?.includes("callback") &&
    req.query.nextauth?.includes("credentials") &&
    req.method === "POST"

export function requestWrapper(
    req: NextApiRequest,
    res: NextApiResponse
): [req: NextApiRequest, res: NextApiResponse, opts: NextAuthOptions] {
    const generateSessionToken = () => randomUUID();

    const fromDate = (time: number, date = Date.now()) =>
        new Date(date + time * 1000);

    const adapter = PrismaAdapter(prisma);

    const opts: NextAuthOptions = {
        pages: {
            signIn: "/login",
        },
        adapter: adapter,
        callbacks: {
            session({ session, user }) {
                //console.log({session, user})
                if (session.user) {
                    session.user = {
                        authID: user.id,
                        profileID: user.profileID,
                        isAdmin: user.isAdmin,
                    }
                }
                return session;
            },
            async signIn({ user, account, profile, email, credentials }) {
                // Check if this sign in callback is being called in the credentials authentication flow. 
                // If so, use the next-auth adapter to create a session entry in the database 
                // (SignIn is called after authorize so we can safely assume the user is valid and already authenticated).
                if (checkIfCredentials(req)) {
                    if (user) {
                        const sessionToken = generateSessionToken();
                        const sessionMaxAge = CREDENTIALS_SESSION_MAX_AGE;
                        const sessionExpiry = fromDate(sessionMaxAge);

                        await adapter.createSession({
                            sessionToken: sessionToken,
                            userId: user.id,
                            expires: sessionExpiry,
                        });

                        const cookies = new Cookies(req, res);
                        cookies.set("next-auth.session-token", sessionToken, {
                            expires: sessionExpiry,
                        });
                    }
                }
                if (account?.provider === "google") {
                    return profile?.email?.endsWith("@pollub.edu.pl")? true : false
                }
                return true;
            },
        },
        jwt: {
            encode: async ({ token, secret, maxAge }) => {
                if (checkIfCredentials(req)) {
                    const cookies = new Cookies(req, res);
                    const cookie = cookies.get("next-auth.session-token");
                    if (cookie) return cookie;
                    return "";
                }
                // Revert to default behaviour when not in the credentials provider callback flow
                return encode({ token, secret, maxAge });
            },
            decode: async ({ token, secret }) => {
                if (checkIfCredentials(req)) return null;
                // Revert to default behaviour when not in the credentials provider callback flow
                return decode({ token, secret });
            },
        },
        secret: env.NEXTAUTH_SECRET,
        //debug: true,
        providers: [
            GoogleProvider({
                clientId: env.GOOGLE_CLIENT_ID,
                clientSecret: env.GOOGLE_CLIENT_SECRET,
                profile: (profile, tokens) => {
                    return {
                        id: profile.sub,
                        email: profile.email
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
                        ...user, 
                        profileID: user.profileID? user.profileID : undefined,
                        isAdmin: user.isAdmin? true : undefined,
                    };
                },
            }),
        ],
    };
    return [req, res, opts];
}