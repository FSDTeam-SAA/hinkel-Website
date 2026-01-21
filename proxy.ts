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

    console.log("-----------------------------------------");
    console.log("Middleware/Proxy Running for:", pathname);
    console.log("Token Present:", !!token);
    
    if (token) {
        console.log("Token Role:", token.role);
    }

    const userRole = (token?.role as string)?.toLowerCase();
    const isAdmin = userRole === "admin" || userRole === "ADMIN";
    const isUser = userRole === "user" || userRole === "guest" || userRole === "USER" || userRole === "GUEST";
    const isGuest = !token;

    // 1. Guest Flow: Unauthenticated users blocked from /dashboard
    if (isGuest && pathname.startsWith("/dashboard")) {
        console.log("Decision: Redirect Guest to /auth/login");
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // 2. Strict Dashboard Access: Only Admins allowed
    if (pathname.startsWith("/dashboard") && !isAdmin) {
        console.log(`Decision: Blocking ${userRole || 'Unknown'} from dashboard. Redirect to /`);
        return NextResponse.redirect(new URL("/", request.url));
    }

    // 3. Admin Flow: Redirect root path (/) to /dashboard
    if (isAdmin && pathname === "/") {
        console.log("Decision: Redirect Admin to /dashboard");
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    console.log("Decision: Proceed to next()");
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
        // dashboard and user routes

        "/((?!api|_next/static|_next/image|assets|favicon.ico|sitemap.xml|robots.txt).*)",
        // "/dashboard/:path*",
        // "/user/:path*",
    ],
};
