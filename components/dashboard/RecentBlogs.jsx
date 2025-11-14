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
      <div className="text-center py-4 sm:py-6 md:py-8">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
          <Edit className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-400" />
        </div>
        <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-1">No posts yet</h3>
        <p className="text-[10px] sm:text-xs text-gray-500 mb-3 sm:mb-4 px-2">Create your first blog post to get started</p>
        <Link href="/dashboard/create">
          <Button size="sm" className="text-xs h-7 sm:h-8 px-3">
            Create Post
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {posts.slice(0, 5).map((post) => (
        <div 
          key={post._id} 
          className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-all duration-200 group active:scale-[0.98]"
        >
          {/* Thumbnail/Icon */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <Edit className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0 space-y-0.5 sm:space-y-1">
            {/* Title and Badge Row */}
            <div className="flex items-start gap-1 sm:gap-2">
              <h3 className="text-xs sm:text-sm font-medium text-gray-900 truncate leading-tight flex-1">
                {post.title}
              </h3>
              <Badge 
                variant={post.published ? "default" : "secondary"} 
                className="text-[10px] xs:text-xs px-1.5 py-0 h-4 sm:h-5 whitespace-nowrap flex-shrink-0"
              >
                {post.published ? "Live" : "Draft"}
              </Badge>
            </div>
            
            {/* Meta Information */}
            <div className="flex items-center gap-1.5 sm:gap-2 xs:gap-3 text-[10px] sm:text-xs text-gray-500 flex-wrap">
              <span className="flex items-center gap-0.5 sm:gap-1 whitespace-nowrap">
                <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                {formatDate(post.createdAt)}
              </span>
              <span className="flex items-center gap-0.5 sm:gap-1 whitespace-nowrap">
                <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                {post.views || 0} views
              </span>
              {post.category && (
                <span className="text-blue-600 font-medium truncate max-w-[80px] xs:max-w-none text-[10px] sm:text-xs">
                  {post.category}
                </span>
              )}
            </div>
          </div>

          {/* Action Button - Always visible on mobile, hover-only on desktop */}
          <Link href={`/dashboard/edit/${post._id}`}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 sm:h-7 sm:w-7 p-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 flex-shrink-0 active:scale-95"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      ))}
      
      {/* View All Link */}
      {posts.length > 5 && (
        <div className="pt-1 sm:pt-2 border-t border-gray-200">
          <Link href="/dashboard/posts">
            <Button variant="ghost" size="sm" className="w-full text-[10px] sm:text-xs text-gray-600 hover:text-gray-900 h-7 sm:h-8">
              View all posts ({posts.length})
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}