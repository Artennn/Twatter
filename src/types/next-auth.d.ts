// eslint-disable-next-line
import NextAuth from "next-auth"
import type { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    export interface User {
        id: string;
        profileID?: number;
        isAdmin?: boolean;
    }

    export interface Session {
        user?: {
            id: string;
            profileID?: number;
            isAdmin?: boolean;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        user?: {
            id: string;
            profileID?: number;
            isAdmin?: boolean;
        };
    }
}