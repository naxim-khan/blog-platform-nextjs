// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from 'jose';

const AUTH_PATHS = ["/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password"];
const PROTECTED_PATHS = ["/dashboard","/api/posts", "/api/user"];
const PUBLIC_API_PATHS = ["/api/auth/login", "/api/auth/register", "/api/auth/forgot-password"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  const token = getCookie(request, 'token');
  
  console.log("Middleware - Path:", pathname, "| Token present:", !!token);

  // Allow public API routes
  if (PUBLIC_API_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  let isValidToken = false;
  let userPayload = null;
  
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      isValidToken = true;
      userPayload = payload;
      console.log("Middleware - Token valid for user:", payload.email);
    } catch (error) {
      console.log("Middleware - Token invalid:", error.message);
      isValidToken = false;
      
      // Clear invalid token
      if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/')) {
        const response = NextResponse.redirect(new URL("/auth/login", request.url));
        response.cookies.delete("token");
        return response;
      }
    }
  }

  // Redirect authenticated users away from auth pages
  if (isValidToken && AUTH_PATHS.some((p) => pathname.startsWith(p))) {
    console.log("Middleware - Redirecting authenticated user to dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users from protected routes
  if (!isValidToken && PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    console.log("Middleware - Redirecting unauthenticated user to login");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

function getCookie(request, name) {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});
  
  return cookies[name] || null;
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/dashboard/:path*", 
    "/api/:path*"
  ],
};