import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Next.js 16 Proxy implementation for secure routing and role-based access control.
 * This runs at the edge to intercept requests before rendering occurs.
 */
export async function proxy(request: NextRequest) {
    const token = await getToken({ req: request });
    const { pathname } = request.nextUrl;

    const isAdmin = token?.role === "admin";
    const isUser = token?.role === "user";
    const isGuest = !token;

    // 1. Guest Flow: Unauthenticated users blocked from /dashboard
    if (isGuest && pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // 2. Admin Flow: Redirect root path (/) to /dashboard
    if (isAdmin && pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // 3. Standard User Flow: Block access to /dashboard* and redirect to /
    if (isUser && pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

/**
 * Optimization: Matcher config to exclude static assets and internal Next.js files.
 * This ensures the proxy logic only runs on relevant application routes.
 */
export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - assets (explicit public assets)
         * - favicon.ico, sitemap.xml, robots.txt
         */
        "/((?!api|_next/static|_next/image|assets|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};
