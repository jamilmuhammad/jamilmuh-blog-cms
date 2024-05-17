import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authRoutes, protectedRoutes } from "@/commons/routes/protected";
import { verifyJwtAccessToken } from "./lib/decode-token.lib";

export async function middleware(request: NextRequest) {
    const access_token = request.cookies.get('access_token')?.value ?? ""

    const hasVerifiedToken = await verifyJwtAccessToken(access_token);
    const exp = (hasVerifiedToken?.exp ?? 0) * 1000

    if (protectedRoutes.includes(request.nextUrl.pathname) && (!access_token || (Date.now() > exp))) {

        request.cookies.delete("access_token")
        request.cookies.delete('refresh_token')
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("access_token");

        return response;
    }

    if (authRoutes.includes(request.nextUrl.pathname) && access_token) {
        return NextResponse.redirect(new URL("/", request.url));
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}