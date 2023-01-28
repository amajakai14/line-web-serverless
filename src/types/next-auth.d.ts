import { type DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      role: string;
      corporation_id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
    corporation_id?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string | null;
    corporation_id?: string | null;
  }
}
