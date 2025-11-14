import { NextResponse } from "next/server";
import { getToken } from "@/lib/auth";
import { generalLimiter, getClientIP, applyRateLimit } from "@/lib/rateLimit";

export async function GET(req) {
  try {
    // Apply rate limiting for auth check
    const clientIP = getClientIP(req);
    const rateLimitResult = await applyRateLimit(generalLimiter, `auth-me:${clientIP}`);

    if (rateLimitResult.isRateLimited) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          }
        }
      );
    }

    const user = await getToken(req);
    
    console.log("API Auth Me - User from token:", user);
    
    // FIX: Return proper structure
    if (!user) {
      console.log("API Auth Me - No user found");
      return NextResponse.json({ user: null }, { status: 200 });
    }

    console.log("API Auth Me - User found:", user);

    return NextResponse.json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        username: user.username,
        bio: user.bio || "",
        website: user.website || ""
      } 
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}