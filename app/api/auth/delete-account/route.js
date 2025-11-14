import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Post from "@/models/Post";
import { safeVerifyToken } from "@/lib/jwt";
import { deleteAccountLimiter, getClientIP, applyRateLimit } from "@/lib/rateLimit";

export async function DELETE(request) {
    try {
        // Get the token from cookies
        const token = request.cookies.get("token")?.value;
        
        if (!token) {
            return NextResponse.json(
                { error: "No authentication token found" },
                { status: 401 }
            );
        }

        // Verify the token safely
        const decoded = await safeVerifyToken(token);
        
        if (!decoded || !decoded.id) {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 401 }
            );
        }

        // Apply rate limiting for delete account
        const clientIP = getClientIP(request);
        const rateLimitResult = await applyRateLimit(deleteAccountLimiter, `delete-account:${clientIP}:${decoded.id}`);

        if (rateLimitResult.isRateLimited) {
            return NextResponse.json(
                { error: "Too many delete attempts. Please try again later." },
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

        // Get user from database to verify existence
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const userId = user._id.toString();

        console.log(`Starting account deletion for user: ${userId} (${user.email})`);

        // Delete all posts by this user
        const deletePostsResult = await Post.deleteMany({ author: userId });
        console.log(`Deleted ${deletePostsResult.deletedCount} posts for user ${userId}`);

        // Delete the user account
        await User.findByIdAndDelete(userId);
        console.log(`Deleted user account: ${userId}`);

        // Create response and clear the authentication cookie
        const response = NextResponse.json(
            { 
                message: "Account and all associated data deleted successfully",
                deletedPosts: deletePostsResult.deletedCount
            },
            { status: 200 }
        );

        // Clear the authentication cookie
        response.cookies.set("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: new Date(0), // Expire immediately
        });

        console.log(`Account deletion completed for user: ${userId}`);
        return response;

    } catch (error) {
        console.error("Error deleting account:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}