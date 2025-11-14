import { NextResponse } from "next/server";
import { getToken } from "@/lib/auth";

export async function GET(req) {
  try {
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