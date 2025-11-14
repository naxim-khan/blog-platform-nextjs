import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { z } from "zod";
import { resetPasswordLimiter, getClientIP, applyRateLimit } from "@/lib/rateLimit";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number")
});

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate input
    const { token, password } = resetPasswordSchema.parse(body);

    // Apply rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = await applyRateLimit(resetPasswordLimiter, `reset-password:${clientIP}:${token}`);

    if (rateLimitResult.isRateLimited) {
      return NextResponse.json(
        { error: "Too many reset attempts. Please try again later." },
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

    await connectDB();

    // Find user with valid reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() } // Check if token is not expired
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    console.log("- Password reset successful for user:", user.email);

    return NextResponse.json({
      message: "Password reset successfully"
    });

  } catch (error) {
    console.error("Reset password error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}