import Link from "next/link";
import { Calendar, Eye, Edit, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function RecentBlogs({ posts, onUpdate }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Edit className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-1">No posts yet</h3>
        <p className="text-xs text-gray-500 mb-4">Create your first blog post to get started</p>
        <Link href="/dashboard/create">
          <Button size="sm" className="text-xs">
            Create Post
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.slice(0, 5).map((post) => (
        <div 
          key={post._id} 
          className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-all duration-200 group"
        >
          {/* Thumbnail/Icon */}
          <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <Edit className="h-4 w-4 text-blue-600" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {post.title}
              </h3>
              <Badge 
                variant={post.published ? "default" : "secondary"} 
                className="text-xs px-1.5 py-0 h-5"
              >
                {post.published ? "Live" : "Draft"}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(post.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {post.views || 0} views
              </span>
              {post.category && (
                <span className="text-blue-600 font-medium">
                  {post.category}
                </span>
              )}
            </div>
          </div>

          {/* Action */}
          <Link href={`/dashboard/edit/${post._id}`}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      ))}
      
      {/* View All Link */}
      {posts.length > 5 && (
        <div className="pt-2 border-t border-gray-200">
          <Link href="/dashboard/posts">
            <Button variant="ghost" size="sm" className="w-full text-xs text-gray-600 hover:text-gray-900">
              View all posts ({posts.length})
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}