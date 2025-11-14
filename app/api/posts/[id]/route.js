import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { postSchema } from "@/lib/validators/post";
import { getToken } from "@/lib/auth";
import { generalLimiter, getClientIP, applyRateLimit } from "@/lib/rateLimit";

// GET single post
export async function GET(req, { params }) {
  try {
    // Apply rate limiting for GET single post
    const clientIP = getClientIP(req);
    const rateLimitResult = await applyRateLimit(generalLimiter, `get-post:${clientIP}`);

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

    await connectDB();
    
    // Await the params promise
    const { id } = await params;
    const post = await Post.findById(id).lean();

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Get Post Error:", error);
    return NextResponse.json({ error: "Error fetching post" }, { status: 500 });
  }
}

// UPDATE post
export async function PUT(req, { params }) {
  try {
    const user = await getToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Apply rate limiting for UPDATE post
    const clientIP = getClientIP(req);
    const rateLimitResult = await applyRateLimit(generalLimiter, `update-post:${clientIP}:${user.id}`);

    if (rateLimitResult.isRateLimited) {
      return NextResponse.json(
        { error: "Too many update attempts. Please try again later." },
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

    // Await the params promise
    const { id } = await params;
    const body = await req.json();
    const validatedData = postSchema.parse(body);

    await connectDB();

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Update post
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        ...validatedData,
        publishedAt: validatedData.published && !post.published ? new Date() : post.publishedAt
      },
      { new: true, runValidators: true }
    ).populate('author', 'username email');

    return NextResponse.json({ 
      message: "Post updated successfully", 
      post: updatedPost 
    });
  } catch (error) {
    console.error("Update Post Error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Error updating post" }, { status: 500 });
  }
}

// DELETE post
export async function DELETE(req, { params }) {
  try {
    const user = await getToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Apply rate limiting for DELETE post
    const clientIP = getClientIP(req);
    const rateLimitResult = await applyRateLimit(generalLimiter, `delete-post:${clientIP}:${user.id}`);

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

    // Await the params promise
    const { id } = await params;
    await connectDB();

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Optional: Check if the user is the author of the post
    // if (post.author.toString() !== user.id) {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    await Post.findByIdAndDelete(id);

    return NextResponse.json({ 
      message: "Post deleted successfully" 
    });
  } catch (error) {
    console.error("Delete Post Error:", error);
    return NextResponse.json({ error: "Error deleting post" }, { status: 500 });
  }
}