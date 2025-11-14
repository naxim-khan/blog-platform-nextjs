"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  Tag, 
  Share2, 
  Bookmark,
  Eye,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id;
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/posts/${postId}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch post');
        }
        
        const postData = await res.json();
        setPost(postData);
        
        // Fetch related posts based on category
        if (postData.category) {
          const relatedRes = await fetch(`/api/posts?category=${postData.category}&limit=3&exclude=${postId}`);
          if (relatedRes.ok) {
            const relatedData = await relatedRes.json();
            setRelatedPosts(relatedData.posts || []);
          }
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading post</p>
          <p className="text-sm text-gray-500 mt-1">Getting everything ready...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Eye className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || "The post you're looking for doesn't exist or has been removed."}
          </p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleShare} className="text-gray-600 hover:text-gray-900">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <header className="text-center mb-12">
          <div className="mb-6">
            <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700 border-blue-200 text-sm px-3 py-1">
              {post.category}
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          {/* Meta Information */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-gray-200">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                  {post.author?.username?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="font-medium text-gray-900">{post.author?.username || 'Unknown Author'}</p>
                <p className="text-gray-500">Author</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {post.publishedAt 
                    ? format(new Date(post.publishedAt), 'MMMM dd, yyyy')
                    : 'Not published'
                  }
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  {post.publishedAt 
                    ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })
                    : 'Draft'
                  }
                </span>
              </div>

              {post.views !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views} views</span>
                </div>
              )}
            </div>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="aspect-video w-full max-w-4xl mx-auto mb-8 rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={post.featuredImage} 
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
        </header>

        {/* Content Section */}
        <div className="prose prose-lg max-w-none">
          {/* TipTap Content Styling */}
          <div 
            className="tiptap-content bg-white rounded-2xl p-8 shadow-sm border border-gray-200/60"
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              lineHeight: '1.7',
              color: '#374151'
            }}
          />
        </div>

        {/* Tags Section */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="px-3 py-1.5 bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Share Section */}
        <Card className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 rounded-2xl">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Enjoyed this post?</h3>
            <p className="text-blue-700 mb-4">Share it with others who might find it useful!</p>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={handleShare}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Post
              </Button>
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 rounded-xl">
                <Bookmark className="h-4 w-4 mr-2" />
                Save for Later
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card 
                  key={relatedPost._id} 
                  className="border border-gray-200 bg-white/80 backdrop-blur-sm rounded-2xl hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] cursor-pointer"
                  onClick={() => router.push(`/post/${relatedPost._id}`)}
                >
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-3 bg-gray-100 text-gray-700 text-xs">
                      {relatedPost.category}
                    </Badge>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {relatedPost.publishedAt 
                          ? format(new Date(relatedPost.publishedAt), 'MMM dd, yyyy')
                          : 'Draft'
                        }
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {relatedPost.views || 0}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Navigation Between Posts */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Button variant="outline" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 rounded-xl">
              <ChevronLeft className="h-4 w-4" />
              Previous Post
            </Button>
            <Button variant="outline" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 rounded-xl">
              Next Post
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>© {new Date().getFullYear()} Your Blog Name. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Custom Styles for TipTap Content */}
      <style jsx global>{`
        .tiptap-content {
          font-size: 1.125rem;
          line-height: 1.7;
        }

        .tiptap-content h1,
        .tiptap-content h2,
        .tiptap-content h3,
        .tiptap-content h4 {
          font-weight: 700;
          line-height: 1.3;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .tiptap-content h1 {
          font-size: 2.25rem;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0.5rem;
        }

        .tiptap-content h2 {
          font-size: 1.875rem;
        }

        .tiptap-content h3 {
          font-size: 1.5rem;
        }

        .tiptap-content h4 {
          font-size: 1.25rem;
        }

        .tiptap-content p {
          margin-bottom: 1.5rem;
        }

        .tiptap-content ul,
        .tiptap-content ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }

        .tiptap-content li {
          margin-bottom: 0.5rem;
        }

        .tiptap-content blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          color: #6b7280;
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 0.5rem;
        }

        .tiptap-content code {
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }

        .tiptap-content pre {
          background: #1f2937;
          color: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 2rem 0;
        }

        .tiptap-content pre code {
          background: none;
          padding: 0;
          color: inherit;
        }

        .tiptap-content a {
          color: #3b82f6;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .tiptap-content a:hover {
          color: #2563eb;
        }

        .tiptap-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 2rem 0;
        }

        .tiptap-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
        }

        .tiptap-content th,
        .tiptap-content td {
          border: 1px solid #e5e7eb;
          padding: 0.75rem;
          text-align: left;
        }

        .tiptap-content th {
          background: #f9fafb;
          font-weight: 600;
        }

        .tiptap-content hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 2rem 0;
        }
      `}</style>
    </div>
  );
}