import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  // database user
  interface User {
    profileID?: number,
    isAdmin?: boolean,
  }
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      authID: string,
      profileID?: number,
      isAdmin?: boolean,
    }
  }
}
