// eslint-disable-next-line
import NextAuth from "next-auth"

declare module "next-auth" {
  // database user
  export interface User {
    profileID?: number,
    isAdmin?: boolean,
  }
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  export interface Session {
    user?: {
      authID: string,
      profileID?: number,
      isAdmin?: boolean,
    }
  }
}
