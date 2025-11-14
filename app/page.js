// app/page.jsx (Server Component)
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, Sparkles, BookOpen, Calendar, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import User from "@/models/User";
import Link from "next/link";
import WorldMap from "@/components/ui/world-map";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";

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

  const featuredPost = safePosts[0];
  const remainingPosts = safePosts.slice(1);
  const draggablePosts = remainingPosts.slice(0, 5); // Only show 5 posts in draggable cards

  // Card classes for draggable cards
  const cardClasses = [
    "absolute top-10 left-[20%] rotate-[-5deg]",
    "absolute top-20 left-[35%] rotate-[3deg]",
    "absolute top-5 left-[50%] rotate-[8deg]",
    "absolute top-32 left-[65%] rotate-[10deg]",
    "absolute top-20 right-[20%] rotate-[-7deg]",
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 ">
      <Navbar />
      {/* Hero Section with World Map and Draggable Cards */}
      <section className="relative h-screen overflow-hidden">
        {/* World Map - Background */}
        <div className="absolute inset-0 z-0">
          <WorldMap
            dots={[
              { start: { lat: 64.2008, lng: -149.4937 }, end: { lat: 34.0522, lng: -118.2437 } },
              { start: { lat: 64.2008, lng: -149.4937 }, end: { lat: -15.7975, lng: -47.8919 } },
              { start: { lat: -15.7975, lng: -47.8919 }, end: { lat: 38.7223, lng: -9.1393 } },
              { start: { lat: 51.5074, lng: -0.1278 }, end: { lat: 28.6139, lng: 77.209 } },
              { start: { lat: 28.6139, lng: 77.209 }, end: { lat: 43.1332, lng: 131.9113 } },
              { start: { lat: 28.6139, lng: 77.209 }, end: { lat: -1.2921, lng: 36.8219 } },
            ]}
          />
        </div>

        {/* Gradient Overlay to make text more readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-purple-600/10 z-0"></div>

        {/* Hero Content - Left Side */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl text-blue-900 px-6 py-3 rounded-full text-sm font-semibold border border-white/30 ">
              <Sparkles className="h-4 w-4" />
              <span>Latest insights and trends</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-blue-700 leading-tight tracking-tight">
                Discover Useful{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-linear-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Content Here !
                  </span>
                  <span className="absolute bottom-2 left-0 w-full h-4 bg-amber-400/20 -rotate-1 rounded-lg blur-sm"></span>
                </span>
              </h1>

              {/* Description */}
              <p className="text-xl sm:text-2xl text-blue-900/90 leading-relaxed max-w-2xl font-light">
                Discover curated insights, expert perspectives, and innovative ideas from our community of passionate writers and thinkers.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Link href="#featured-post">
                <Button className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl text-blue-900 px-6 py-3 rounded-sm text-sm font-semibold border border-white/30 shadow-xl hover:text-blue-900 hover:bg-blue-100">
                  Explore Latest Article
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Draggable Cards - Right Side by Default */}
        {draggablePosts.length > 0 && (
          <DraggableCardContainer className="absolute inset-0 z-20 pointer-events-none">

            {/* Guidance Animation - Grab Hand Icon */}
            <div className="absolute top-10 right-10 z-30 flex items-center gap-2 bg-black/30 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm animate-bounce">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                />
              </svg>
              <span>Drag the card to explore</span>
            </div>

            {draggablePosts.map((post, index) => {
              // Card classes positioned more to the right side by default
              const rightSideCardClasses = [
                "absolute top-10 right-[5%] rotate-[-5deg]",
                "absolute top-20 right-[20%] rotate-[3deg]",
                "absolute top-5 right-[35%] rotate-[8deg]",
                "absolute top-32 right-[50%] rotate-[10deg]",
                "absolute top-20 right-[65%] rotate-[-7deg]",
              ];

              return (
                <DraggableCardBody
                  key={post._id}
                  className={`${rightSideCardClasses[index % rightSideCardClasses.length]} pointer-events-auto group cursor-grab active:cursor-grabbing`}
                >
                  {/* Subtle hover animation to indicate interactivity */}
                  <div className="transition-transform duration-200 group-hover:scale-105">
                    {post.featuredImage ? (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="pointer-events-none relative z-10 h-80 w-80 object-cover"
                      />
                    ) : (
                      <div className="pointer-events-none relative z-10 h-80 w-80 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-white opacity-80" />
                      </div>
                    )}
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="mt-4 text-center text-lg font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                      {post.title.length > 30 ? `${post.title.substring(0, 55)}...` : post.title}
                    </h3>
                  </Link>
                </DraggableCardBody>
              );
            })}
          </DraggableCardContainer>
        )}

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-30">
          <div className="w-6 h-10 border-2 border-blue-900/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-blue-900/70 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section id="featured-post" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 space-y-6">
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 text-sm font-semibold border-0 shadow-lg">
            <Sparkles className="h-4 w-4 mr-2" />
            Featured Content
          </Badge>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
            Latest <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Articles</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Explore the most recent publications from our community of writers and thinkers.
          </p>
        </div>

        {safePosts.length > 0 ? (
          <>
            {/* Featured Post Highlight */}
            {featuredPost && (
              <div className="mb-16 group cursor-pointer">
                <Card className="border-0 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 rounded-3xl overflow-hidden ">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="p-8 lg:p-12 flex flex-col justify-center space-y-6">
                        <div className="flex items-center gap-4">
                          <Badge className="bg-green-500 hover:bg-green-600 text-white border-0">
                            Latest
                          </Badge>
                          <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(featuredPost.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                          {featuredPost.title}
                        </h3>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                          {featuredPost.excerpt || "Discover this amazing content from our community..."}
                        </p>
                        <div className="flex items-center justify-between pt-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {featuredPost.author?.username?.charAt(0) || "U"}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-white">
                                {featuredPost.author?.username || "Unknown Author"}
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                {featuredPost.readTime || "5"} min read
                              </div>
                            </div>
                          </div>
                          <Link href={`/blog/${featuredPost.slug}`}>
                            <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-white/90 dark:text-slate-900 text-white rounded-xl px-6 py-3 group">
                              Read More
                              <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                      <div className="relative h-64 lg:h-auto min-h-[300px] rounded-2xl m-4 overflow-hidden">
                        {featuredPost.image ? (
                          <img
                            src={featuredPost.image}
                            alt={featuredPost.title}
                            className="w-full h-full object-cover rounded-2xl"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                            <div className="text-white text-center space-y-4">
                              <BookOpen className="h-16 w-16 mx-auto opacity-80" />
                              <div className="text-2xl font-bold">Featured Story</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Remaining Posts Grid */}
            {remainingPosts.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                  {remainingPosts.map((post, index) => (
                    <div key={post._id} className="group hover:scale-105 transition-transform duration-300">
                      <PostCard post={post} priority={index < 3} />
                    </div>
                  ))}
                </div>

                {/* View All Posts Button - Only if we have many posts */}
                {safePosts.length > 6 && (
                  <div className="text-center">
                    <Link href="/posts">
                      <Button variant="outline" className="border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-12 py-6 text-lg font-semibold rounded-2xl hover:scale-105 transition-all duration-300 group">
                        View All Articles
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          /* Empty State */
          <Card className="border-0 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Search className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                No Articles Available Yet
              </CardTitle>
              <CardDescription className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                We're preparing amazing content for you. Check back soon for insightful articles from our community!
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Simple CTA Section */}
      {safePosts.length > 0 && (
        <section className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Enjoying the <span className="bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">Content?</span>
              </h2>
              <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
                Discover more insightful articles and stay updated with the latest from our community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                <Link href="#featured-post">
                  <Button className="bg-amber-400 hover:bg-amber-300 text-slate-900 px-12 py-6 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300">
                    Continue Reading
                    <BookOpen className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}