// app/page.jsx (Server Component)
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowRight, Search, Sparkles, BookOpen, Users, Zap } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import User from "@/models/User";

export const revalidate = 60;

export default async function HomePage() {
  await connectDB();

  const posts = await Post.find({ published: true })
    .populate("author", "username email avatar")
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  const safePosts = posts.map((post) => ({
    ...post,
    _id: post._id?.toString(),
    author: post.author
      ? {
        ...post.author,
        _id: post.author._id?.toString(),
        username: post.author.username || "Unknown",
        email: post.author.email || "",
        avatar: post.author.avatar || "",
      }
      : null,
    createdAt: post.createdAt?.toISOString?.(),
    updatedAt: post.updatedAt?.toISOString?.(),
    publishedAt: post.publishedAt?.toISOString?.(),
  }));

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative  overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900">
        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-10" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-15">
          <div className="text-center max-w-4xl mx-auto space-y-2">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-medium border border-white/20 shadow-sm">
              <Sparkles className="h-4 w-4" />
              <span>Latest insights and trends</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-xl sm:text-1xl lg:text-2xl font-bold text-white leading-tight tracking-tight">
              Crafting Digital{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Excellence</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-white/20 -rotate-1"></span>
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto font-light">
              Discover curated insights, expert perspectives, and innovative ideas
              from our community of passionate writers and thinkers.
            </p>

          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full ">
        <div className="text-center mb-12 space-y-4">
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-4 py-1.5 text-sm font-medium border-0">
            Latest Publications
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Recent Articles
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Explore our most recent publications and stay updated with the latest insights from our community.
          </p>
        </div>

        {safePosts.length > 0 ? (
          <>
            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 items-center justify-centerw-full">
              {safePosts.map((post, index) => (
                <PostCard key={post._id} post={post} priority={index < 3} />
              ))}
            </div>


          </>
        ) : (
          /* Empty State */
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Search className="h-10 w-10 text-slate-400 dark:text-slate-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                No Articles Available
              </CardTitle>
              <CardDescription className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                No articles have been published yet. Check back soon for amazing content!
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </section>





      <Footer />
    </div>
  );
}