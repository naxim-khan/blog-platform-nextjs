import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { changePasswordLimiter, getClientIP, applyRateLimit } from "@/lib/rateLimit";

export async function POST(req) {
  try {
    const user = await getToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Apply rate limiting
    const clientIP = getClientIP(req);
    const rateLimitResult = await applyRateLimit(changePasswordLimiter, `change-password:${clientIP}:${user.id}`);

    if (rateLimitResult.isRateLimited) {
      return NextResponse.json(
        { error: "Too many password change attempts. Please try again later." },
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

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    // Validation
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    await connectDB();

    // Get user with password
    const userData = await User.findById(user.id);
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userData.password);
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    // Check if new password is same as current password
    const isSamePassword = await bcrypt.compare(newPassword, userData.password);
    if (isSamePassword) {
      return NextResponse.json({ error: "New password cannot be the same as current password" }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await User.findByIdAndUpdate(user.id, {
      password: hashedPassword,
      updatedAt: new Date()
    });

    return NextResponse.json({ 
      message: "Password updated successfully" 
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    return NextResponse.json({ error: "Error changing password" }, { status: 500 });
  }
}