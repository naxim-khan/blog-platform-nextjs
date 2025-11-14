import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { getToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const user = await getToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const posts = await Post.find({ author: user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Get My Posts Error:", error);
    return NextResponse.json({ error: "Error fetching posts" }, { status: 500 });
  }
}