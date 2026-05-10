import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      role: string;
    };
    accessToken: string;
    refreshToken: string;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    role: string;
    token: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    image: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  }
}
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
