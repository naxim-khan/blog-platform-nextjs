"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, Download, MoreHorizontal, FileText, Eye, Clock, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import BlogTable from "@/components/dashboard/BlogTable";

export default function PostsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    if (user) {
      fetchAllPosts();
    }
  }, [user]);

  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/my-posts');
      const data = await res.json();
      
      if (res.ok) {
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter posts based on search and filters
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "published" && post.published) ||
                         (statusFilter === "draft" && !post.published);
    
    const matchesCategory = categoryFilter === "all" || post.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Get unique categories for filter
  const categories = [...new Set(posts.map(post => post.category).filter(Boolean))];

  // Calculate stats
  const stats = {
    total: posts.length,
    published: posts.filter(post => post.published).length,
    drafts: posts.filter(post => !post.published).length
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading your posts</p>
          <p className="text-sm text-gray-500 mt-1">Getting everything ready...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-5">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-violet-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-fuchsia-300/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-300/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-sm">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                Blog Posts
              </h1>
              <p className="text-gray-600 mt-1 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                Manage all your content
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200/50 shadow-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Active</span>
          </div>
          <Button className="group relative overflow-hidden flex items-center gap-2 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 text-white shadow-sm rounded-xl px-6 py-2.5 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Plus className="h-4 w-4 relative" />
            <span className="relative">Create New Post</span>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="group relative bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 h-fit overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardContent className="px-4 relative">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{stats.total}</p>
                <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                  <TrendingUp className="h-3 w-3" />
                  <span>All content</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 h-fit overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardContent className="px-4 relative">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{stats.published}</p>
                <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <Eye className="h-3 w-3" />
                  <span>Live on site</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                <Eye className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 h-fit overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardContent className="px-4 relative">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{stats.drafts}</p>
                <div className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                  <Clock className="h-3 w-3" />
                  <span>In progress</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="group relative border border-gray-200/50 bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <CardContent className="p-6 relative">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search */}
            <div className="flex-1 w-full group/search">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 transition-colors group-hover/search:text-purple-500" />
                <Input
                  placeholder="Search posts by title, content, or excerpt..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300/50 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover/search:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Status Filter */}
              <div className="relative group/filter">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[160px] border-gray-300/50 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300">
                    <Filter className="h-4 w-4 mr-2 text-blue-500" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="backdrop-blur-xl bg-white/95">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Drafts</SelectItem>
                  </SelectContent>
                </Select>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover/filter:opacity-100 transition-opacity pointer-events-none"></div>
              </div>

              {/* Category Filter */}
              <div className="relative group/category">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-[160px] border-gray-300/50 focus:border-emerald-400 focus:ring-emerald-400/20 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="backdrop-blur-xl bg-white/95">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover/category:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Posts Table */}
      <Card className="border border-gray-200 bg-white/80 backdrop-blur-sm rounded-2xl">
        <CardHeader className="pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">All Blog Posts</CardTitle>
                <CardDescription className="text-gray-600">
                  Manage, edit, and publish your blog posts
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="rounded-lg px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
              {posts.length} total
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-2">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-lg font-medium text-gray-700">Loading posts</p>
                <p className="text-sm text-gray-500 mt-1">Fetching your content...</p>
              </div>
            </div>
          ) : (
            <BlogTable posts={filteredPosts} onUpdate={fetchAllPosts} />
          )}
        </CardContent>
      </Card>

      {/* Enhanced Empty State */}
      {!loading && posts.length === 0 && (
        <Card className="border border-blue-200 bg-linear-to-br from-blue-50 to-indigo-50 text-center rounded-2xl">
          <CardContent className="p-12">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-3">
                No posts yet
              </h3>
              <p className="text-blue-700 mb-8 text-lg">
                Ready to share your thoughts with the world? Create your first blog post and start building your audience.
              </p>
              <Link href="/dashboard/create">
                <Button className="flex items-center gap-2 mx-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl px-8 py-3 text-base">
                  <Plus className="h-5 w-5" />
                  Create Your First Post
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced No Results State */}
      {!loading && posts.length > 0 && filteredPosts.length === 0 && (
        <Card className="border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 text-center rounded-2xl">
          <CardContent className="p-12">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-linear-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-amber-900 mb-3">
                No posts found
              </h3>
              <p className="text-amber-700 mb-8 text-lg">
                No posts match your current search or filters. Try adjusting your criteria or clear filters to see all posts.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setCategoryFilter("all");
                  }}
                  className="border-amber-300 text-amber-700 hover:bg-amber-100 rounded-xl"
                >
                  Clear All Filters
                </Button>
                <Link href="/dashboard/create">
                  <Button className="bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Post
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}