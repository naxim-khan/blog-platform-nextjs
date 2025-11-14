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

    // Get all user posts
    const posts = await Post.find({ author: user.id }).sort({ createdAt: -1 });

    // Calculate stats
    const totalPosts = posts.length;
    const published = posts.filter(post => post.published).length;
    const drafts = totalPosts - published;
    const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);

    // Generate monthly data for current year
    const currentYear = new Date().getFullYear();
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(currentYear, i, 1);
      const monthStart = new Date(currentYear, i, 1);
      const monthEnd = new Date(currentYear, i + 1, 0);
      
      const monthPosts = posts.filter(post => {
        const postDate = new Date(post.createdAt);
        return postDate >= monthStart && postDate <= monthEnd;
      });

      return {
        month: month.toLocaleDateString('en-US', { month: 'short' }),
        posts: monthPosts.length
      };
    });

    // Generate recent activities
    const recentActivities = posts.slice(0, 5).map(post => ({
      id: post._id,
      type: post.published ? 'published' : 'created',
      title: post.title,
      description: post.published ? 'Post published' : 'Draft created',
      timestamp: post.publishedAt || post.createdAt
    }));

    return NextResponse.json({
      stats: {
        totalPosts,
        published,
        drafts,
        totalViews
      },
      monthlyData,
      recentActivities,
      posts: posts.slice(0, 10) // Recent 10 posts for table
    });

  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Error fetching dashboard data" }, { status: 500 });
  }
}