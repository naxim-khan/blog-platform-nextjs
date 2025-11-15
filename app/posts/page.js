// app/posts/page.jsx (Server Component)
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, Sparkles, BookOpen, Filter, X, Loader } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import User from "@/models/User";
import Link from "next/link";

export const revalidate = 60;

// Client component for search and pagination
import { PostsClient } from "./PostsClient";

export default async function PostsPage({ searchParams }) {
  await connectDB();

  // Properly await searchParams since it's a Promise
  const params = await searchParams;
  const searchQuery = params?.q || '';
  const categoryFilter = params?.category || '';
  const page = parseInt(params?.page) || 1;
  const limit = 9; // Posts per page

  // Build search filter
  let searchFilter = { published: true };
  
  if (searchQuery) {
    searchFilter.$or = [
      { title: { $regex: searchQuery, $options: 'i' } },
      { excerpt: { $regex: searchQuery, $options: 'i' } },
      { content: { $regex: searchQuery, $options: 'i' } },
      { tags: { $in: [new RegExp(searchQuery, 'i')] } }
    ];
  }

  if (categoryFilter) {
    searchFilter.category = categoryFilter;
  }

  // Get posts with pagination
  const skip = (page - 1) * limit;
  
  const [posts, totalPosts, categories] = await Promise.all([
    Post.find(searchFilter)
      .populate("author", "username email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    
    Post.countDocuments(searchFilter),
    
    Post.distinct("category", { published: true })
  ]);

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

  const hasMore = page * limit < totalPosts;
  const hasSearch = searchQuery || categoryFilter;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-12 xs:py-16 sm:py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6 xs:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl text-white px-4 xs:px-6 py-2 xs:py-3 rounded-full text-xs xs:text-sm font-semibold border border-white/30">
              <Sparkles className="h-3 w-3 xs:h-4 xs:w-4" />
              <span>Explore All Articles</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4 xs:space-y-6">
              <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Discover Our{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
                    Content Library
                  </span>
                  <span className="absolute bottom-1 xs:bottom-2 left-0 w-full h-3 xs:h-4 bg-blue-900/30 -rotate-1 rounded-lg blur-sm"></span>
                </span>
              </h1>

              {/* Description */}
              <p className="text-base xs:text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto font-light">
                Browse through our complete collection of articles, insights, and stories from our community of passionate writers.
              </p>
            </div>

            {/* Search Box */}
            <div className="max-w-2xl mx-auto">
              <form className="relative group" action="/posts" method="GET">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Search articles by title, content, or tags..."
                    defaultValue={searchQuery}
                    className="w-full pl-12 pr-24 py-4 bg-white/95 backdrop-blur-xl border border-white/30 rounded-2xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white/50 shadow-2xl text-base xs:text-lg"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    {hasSearch && (
                      <Link 
                        href="/posts"
                        className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        <X className="h-4 w-4" />
                        Clear
                      </Link>
                    )}
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
                    >
                      Search
                    </button>
                  </div>
                </div>
                
                {/* Hidden fields to preserve category when searching */}
                {categoryFilter && (
                  <input type="hidden" name="category" value={categoryFilter} />
                )}
              </form>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                <Link
                  href="/posts"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    !categoryFilter 
                      ? 'bg-white text-blue-600 shadow-lg' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  All Categories
                </Link>
                {categories.filter(Boolean).map((category) => (
                  <Link
                    key={category}
                    href={`/posts?category=${encodeURIComponent(category)}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`}
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      categoryFilter === category
                        ? 'bg-white text-blue-600 shadow-lg'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"></div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-12 xs:py-16 sm:py-20">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 xs:mb-12 gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-slate-900">
              {hasSearch ? 'Search Results' : 'All Articles'}
            </h2>
            <p className="text-slate-600 text-base xs:text-lg">
              {hasSearch ? (
                safePosts.length > 0 ? (
                  `Found ${totalPosts} article${totalPosts === 1 ? '' : 's'} matching your search`
                ) : (
                  'No articles found matching your search criteria'
                )
              ) : (
                `Browse our collection of ${totalPosts} articles`
              )}
            </p>
            {page > 1 && (
              <p className="text-sm text-slate-500">
                Page {page} • Showing {safePosts.length} of {totalPosts} articles
              </p>
            )}
          </div>

          {hasSearch && safePosts.length > 0 && (
            <Link 
              href="/posts"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm xs:text-base"
            >
              <X className="h-4 w-4" />
              Clear filters
            </Link>
          )}
        </div>

        {/* Posts Grid */}
        {safePosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-8">
              {safePosts.map((post, index) => (
                <div key={post._id} className="group hover:scale-105 transition-transform duration-300">
                  <PostCard post={post} priority={index < 6} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <PostsClient 
              currentPage={page}
              hasMore={hasMore}
              searchQuery={searchQuery}
              categoryFilter={categoryFilter}
              totalPosts={totalPosts}
            />
          </>
        ) : (
          /* Empty State */
          <Card className="border-0 bg-gradient-to-br from-slate-50 to-blue-50 shadow-2xl rounded-3xl overflow-hidden max-w-2xl mx-auto">
            <CardContent className="p-8 xs:p-12 sm:p-16 text-center">
              <div className="w-20 h-20 xs:w-24 xs:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 xs:mb-8 shadow-xl">
                <Search className="h-8 w-8 xs:h-10 xs:w-10 text-white" />
              </div>
              <CardTitle className="text-2xl xs:text-3xl font-bold text-slate-900 mb-4 xs:mb-6">
                {hasSearch ? 'No Articles Found' : 'No Articles Available Yet'}
              </CardTitle>
              <CardDescription className="text-base xs:text-lg text-slate-600 leading-relaxed max-w-md mx-auto mb-6 xs:mb-8">
                {hasSearch 
                  ? "We couldn't find any articles matching your search. Try different keywords or browse all categories."
                  : "We're preparing amazing content for you. Check back soon for insightful articles from our community!"
                }
              </CardDescription>
              {hasSearch ? (
                <Link href="/posts">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
                    Browse All Articles
                  </Button>
                </Link>
              ) : (
                <Link href="/">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
                    Return Home
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </section>

      {/* CTA Section */}
      {safePosts.length > 0 && (
        <section className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 xs:py-16 sm:py-20">
          <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto space-y-6 xs:space-y-8">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Can't Find What You're{" "}
                <span className="bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
                  Looking For?
                </span>
              </h2>
              <p className="text-base xs:text-lg sm:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
                Suggest topics you'd like us to cover or join our community to contribute your own insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 xs:pt-8">
                <Link href="/">
                  <Button className="bg-amber-400 hover:bg-amber-300 text-slate-900 px-8 xs:px-12 py-4 xs:py-6 text-base xs:text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                    Return Home
                    <BookOpen className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 xs:px-12 py-4 xs:py-6 text-base xs:text-lg font-semibold rounded-xl hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                    Return Home
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