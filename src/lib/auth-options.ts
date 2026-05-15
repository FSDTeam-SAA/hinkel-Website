import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { refreshAccessToken } from "@/features/auth/api/refresh-token.api";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

type LoginPayload = {
  success?: boolean;
  status?: boolean;
  message?: string;
  data?: {
    user?: {
      _id?: string;
      id?: string;
      name?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      role?: string;
      profileImage?: string | null;
      refreshToken?: string;
      image?: string | { url?: string | null } | null;
    };
    accessToken?: string;
    refreshToken?: string;
  };
};

type LoginUser = NonNullable<NonNullable<LoginPayload["data"]>["user"]>;

function getCookieValue(cookieHeader: string | null, cookieName: string) {
  if (!cookieHeader) {
    return null;
  }

  const match = cookieHeader.match(
    new RegExp(`(?:^|(?:,|;)\\s*)${cookieName}=([^;,\\s]+)`),
  );

  return match?.[1] ?? null;
}

function getDisplayName(user: LoginUser | undefined) {
  if (!user) {
    return "";
  }

  if (typeof user.name === "string" && user.name.trim()) {
    return user.name.trim();
  }

  const firstName = user.firstName?.trim() ?? "";
  const lastName = user.lastName?.trim() ?? "";
  return [firstName, lastName].filter(Boolean).join(" ");
}

function getUserImage(user: LoginUser | undefined) {
  if (!user) {
    return "";
  }

  if (typeof user.profileImage === "string") {
    return user.profileImage;
  }

  if (typeof user.image === "string") {
    return user.image;
  }

  if (user.image && typeof user.image === "object") {
    return user.image.url ?? "";
  }

  return "";
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const res = await fetch(`${baseUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const data = (await res.json()) as LoginPayload;

        if (!res.ok) {
          throw new Error(
            JSON.stringify({
              status: res.status,
              message: data.message || "Login failed",
              data: data.data || null,
            }),
          );
        }

        const user = data.data?.user;
        const userId = user?._id || user?.id;
        const accessToken = data.data?.accessToken;
        const refreshToken =
          data.data?.refreshToken ||
          user?.refreshToken ||
          getCookieValue(res.headers.get("set-cookie"), "refreshToken");

        if (!user || !userId || !accessToken || !refreshToken) {
          throw new Error(
            JSON.stringify({
              status: res.status,
              message:
                "Login succeeded, but the server response was missing required auth fields.",
              data: {
                hasUser: Boolean(user),
                hasUserId: Boolean(userId),
                hasAccessToken: Boolean(accessToken),
                hasRefreshToken: Boolean(refreshToken),
              },
            }),
          );
        }

        return {
          id: userId,
          name: getDisplayName(user) || user.email || "User",
          email: user.email || credentials.email,
          image: getUserImage(user),
          role: user.role || "user",
          token: accessToken,
          refreshToken,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          accessToken: user.token,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + 60 * 60 * 1000,
        };
      }

      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }

      if (
        typeof token.accessTokenExpires === "number" &&
        Date.now() < token.accessTokenExpires
      ) {
        return token;
      }

      try {
        const refreshedTokens = await refreshAccessToken(token.refreshToken);

        if (!refreshedTokens.status) {
          throw refreshedTokens;
        }

        return {
          ...token,
          accessToken: refreshedTokens.data.accessToken,
          accessTokenExpires: Date.now() + 60 * 60 * 1000,
          refreshToken: refreshedTokens.data.refreshToken || token.refreshToken,
        };
      } catch (error) {
        console.error("Error refreshing access token", error);
        return {
          ...token,
          error: "RefreshAccessTokenError",
        };
      }
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          name: token.name,
          email: token.email,
          image: token.image,
          role: token.role,
        };
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.error = token.error;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
