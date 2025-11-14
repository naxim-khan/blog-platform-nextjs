// app/api/auth/verify-reset-token/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    console.log("🔍 Token verification request:", token);

    if (!token) {
      console.log("- No token provided");
      return NextResponse.json(
        { error: "Reset token is required" },
        { status: 400 }
      );
    }

    await connectDB();
    console.log("- Database connected");

    // Find user with valid reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() } // Check if token is not expired
    });

    console.log("🔍 User found:", user ? user.email : "No user found");
    
    if (user) {
      console.log("🔍 Reset token expiry:", user.resetTokenExpiry);
      console.log("🔍 Current time:", new Date());
      console.log("🔍 Token valid until:", user.resetTokenExpiry > new Date());
    }

    if (!user) {
      // Let's also check if there's a user with this token but expired
      const expiredUser = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $lt: new Date() }
      });

      if (expiredUser) {
        console.log("- Token exists but expired for user:", expiredUser.email);
        return NextResponse.json(
          { error: "Reset token has expired" },
          { status: 400 }
        );
      }

      console.log("- No user found with this token");
      return NextResponse.json(
        { error: "Invalid reset token" },
        { status: 400 }
      );
    }

    console.log("- Token is valid for user:", user.email);
    return NextResponse.json({
      message: "Token is valid",
      email: user.email
    });

  } catch (error) {
    console.error("- Token verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify reset token" },
      { status: 500 }
    );
  }
}