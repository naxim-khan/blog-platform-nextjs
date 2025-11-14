import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { postSchema } from "@/lib/validators/post";
import { getToken } from "@/lib/auth";
import { slugify } from '@/lib/utils/slugify';
import { generalLimiter, postCreationLimiter, getClientIP, applyRateLimit } from "@/lib/rateLimit";

export async function GET(req) {
    try {
        // Apply rate limiting for GET posts
        const clientIP = getClientIP(req);
        const rateLimitResult = await applyRateLimit(generalLimiter, `get-posts:${clientIP}`);

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

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find({ published: true })
            .populate('author', 'username email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Post.countDocuments({ published: true });

        return NextResponse.json({
            posts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Get Posts Error:", error);
        return NextResponse.json({ error: "Error fetching posts" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const user = await getToken(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Apply rate limiting for POST posts
        const clientIP = getClientIP(req);
        const rateLimitResult = await applyRateLimit(postCreationLimiter, `create-post:${clientIP}:${user.id}`);

        if (rateLimitResult.isRateLimited) {
            return NextResponse.json(
                { error: "Too many post creation attempts. Please slow down." },
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
        const validatedData = postSchema.parse(body);

        await connectDB();

        const post = new Post({
            ...validatedData,
            slug: validatedData.slug || slugify(validatedData.title), // generate slug if missing
            author: user.id,
            publishedAt: validatedData.published ? new Date() : null
        });

        await post.save();
        await post.populate('author', 'username email');

        return NextResponse.json({
            message: "Post created successfully",
            post
        }, { status: 201 });
    } catch (error) {
        console.error("Create Post Error:", error);
        if (error.name === "ZodError") {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: "Error creating post" }, { status: 500 });
    }
}