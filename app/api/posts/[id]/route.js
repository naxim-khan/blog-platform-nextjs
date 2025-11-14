import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import User from "@/models/User";
import { postSchema } from "@/lib/validators/post";
import { getToken } from "@/lib/auth";
import { generalLimiter, getClientIP, applyRateLimit } from "@/lib/rateLimit";

// ----------------------
// GET SINGLE POST
// ----------------------
export async function GET(req, { params }) {
  try {
    const { id } = await params;   // FIX: await params

    const clientIP = getClientIP(req);

    const rate = await applyRateLimit(generalLimiter, `get-post:${clientIP}`);
    if (rate.isRateLimited) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    await connectDB();

    const post = await Post.findById(id)
      .populate("author", "username email")
      .lean();

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Get Post Error:", error);
    return NextResponse.json({ error: "Error fetching post" }, { status: 500 });
  }
}

// ----------------------
// UPDATE POST
// ----------------------
export async function PUT(req, { params }) {
  try {
    const user = await getToken(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;   // FIX: await params
    const clientIP = getClientIP(req);

    const rate = await applyRateLimit(
      generalLimiter,
      `update-post:${clientIP}:${user.id}`
    );
    if (rate.isRateLimited) {
      return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
    }

    const body = await req.json();
    const validated = postSchema.parse(body);

    await connectDB();

    const post = await Post.findById(id);
    if (!post)
      return NextResponse.json({ error: "Post not found" }, { status: 404 });

    if (post.author.toString() !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        ...validated,
        publishedAt:
          validated.published && !post.published
            ? new Date()
            : post.publishedAt,
      },
      { new: true, runValidators: true }
    ).populate("author", "username email");

    return NextResponse.json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Update Post Error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Error updating post" }, { status: 500 });
  }
}

// ----------------------
// DELETE POST
// ----------------------
export async function DELETE(req, { params }) {
  try {
    const user = await getToken(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;   // FIX: await params
    const clientIP = getClientIP(req);

    const rate = await applyRateLimit(
      generalLimiter,
      `delete-post:${clientIP}:${user.id}`
    );
    if (rate.isRateLimited) {
      return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
    }

    await connectDB();

    const post = await Post.findById(id);
    if (!post)
      return NextResponse.json({ error: "Post not found" }, { status: 404 });

    if (post.author.toString() !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Post.findByIdAndDelete(id);

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete Post Error:", error);
    return NextResponse.json({ error: "Error deleting post" }, { status: 500 });
  }
}
