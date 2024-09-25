import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export {default} from "next-auth/middleware"
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token=await getToken({req:request,secret:process.env.NEXTAUTH_SECRET});
    if(token && request.nextUrl.pathname.startsWith('/set-username')){
        return NextResponse.next();
    }
    if(token &&
        (
            request.nextUrl.pathname.startsWith("/sign-in") ||
            request.nextUrl.pathname.startsWith("/sign-up") ||
            request.nextUrl.pathname.startsWith("/verify") ||
            request.nextUrl.pathname==="/"
        )
    ){
        return NextResponse.redirect(new URL("/dashboard",request.url))
    }

    if(!token && 
        (
            request.nextUrl.pathname.startsWith("/dashboard") ||
            request.nextUrl.pathname.startsWith('/set-username')
        )
    ){
        return NextResponse.redirect(new URL("/sign-in",request.url))
    }
    
    return NextResponse.next();
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher:[
    "/sign-in",
    "/sign-up",
    "/verify/:path*",
    "/",
    "/dashboard/:path*",
    "/set-username"
  ]
}