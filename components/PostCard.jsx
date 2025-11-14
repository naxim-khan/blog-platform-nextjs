"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Eye, Clock, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function PostCard({ post, className, priority = false }) {
  const router = useRouter();

  // --- 🧩 Ensure post is plain JSON-safe (fallback in case API didn't serialize) ---
  const safePost = JSON.parse(
    JSON.stringify({
      ...post,
      _id: post?._id?.toString?.() ?? post?._id ?? "",
      author: post?.author
        ? {
            ...post.author,
            _id: post.author._id?.toString?.() ?? post.author._id ?? "",
          }
        : null,
    })
  );

  // --- Date formatting ---
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Unknown date";
    }
  };

  // --- Author initials ---
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // --- Reading time ---
  const getReadingTime = (content) => {
    if (!content) return "5 min";

    let textContent = "";
    if (typeof content === "string") {
      try {
        const parsed = JSON.parse(content);
        textContent = JSON.stringify(parsed);
      } catch {
        textContent = content;
      }
    } else {
      textContent = JSON.stringify(content);
    }

    const wordCount = textContent.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    return `${readingTime} min`;
  };

  // --- Author click handler ---
  const handleAuthorClick = (e, authorId) => {
    e.stopPropagation();
    e.preventDefault();
    if (!authorId) return;
    router.push(`/user/${authorId}`);
  };

  return (
    <Card
      className={cn(
        "group cursor-pointer py-0 transition-all duration-300 hover:shadow-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden flex flex-col h-full min-h-[420px] hover:border-blue-200 dark:hover:border-blue-800",
        priority && "ring-2 ring-blue-500/20",
        className
      )}
    >
      <Link href={`/blog/${safePost.slug}`} className="block h-full flex flex-col flex-1">
        <CardHeader className="p-0 flex-1">
          {/* --- Featured Image --- */}
          {safePost.featuredImage ? (
            <div className="relative h-44 md:h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={safePost.featuredImage}
                alt={safePost.title}
                className="h-full w-full object-cover transition-all duration-300"
                loading={priority ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Category Badge */}
              {safePost.category && (
                <div className="absolute top-3 left-3">
                  <Badge
                    variant="secondary"
                    className="bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 backdrop-blur-sm text-xs font-medium px-2 py-1 border-0"
                  >
                    {safePost.category}
                  </Badge>
                </div>
              )}

              {/* Hover Arrow Indicator */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full p-1.5">
                  <ArrowUpRight className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-44 md:h-52 w-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 flex items-center justify-center transition-all duration-300">
              <div className="text-4xl text-slate-300 dark:text-slate-600">
                📝
              </div>
            </div>
          )}

          <CardContent className="p-4 flex flex-col flex-1">
            {/* --- Tags --- */}
            {safePost.tags && safePost.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {safePost.tags.slice(0, 2).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 border-0"
                  >
                    {tag.replace('#', '')}
                  </Badge>
                ))}
                {safePost.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5 border-slate-300 dark:border-slate-600">
                    +{safePost.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}

            {/* --- Title --- */}
            <CardTitle className="text-lg font-bold line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 mb-2 text-slate-900 dark:text-white">
              {safePost.title}
            </CardTitle>

            {/* --- Excerpt --- */}
            {safePost.excerpt && (
              <CardDescription className="line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 mb-4 flex-1">
                {safePost.excerpt}
              </CardDescription>
            )}

            {/* --- Meta Info --- */}
            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs">
                    {formatDate(safePost.publishedAt || safePost.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">
                    {getReadingTime(safePost.content)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span className="text-xs">{safePost.views || 0}</span>
              </div>
            </div>
          </CardContent>
        </CardHeader>
      </Link>

      {/* --- Author Footer --- */}
      <CardFooter className="p-4 pt-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={(e) => handleAuthorClick(e, safePost.author?._id)}
            className="flex items-center gap-3 w-full hover:bg-white dark:hover:bg-slate-700 rounded-lg p-2 transition-all duration-200 group/author"
          >
            <Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-600 group-hover/author:border-blue-300 dark:group-hover/author:border-blue-600 transition-colors">
              <AvatarImage
                src={safePost.author?.avatar}
                alt={safePost.author?.username}
                className="transition-transform duration-200"
              />
              <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                {getInitials(safePost.author?.username)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate group-hover/author:text-blue-600 dark:group-hover/author:text-blue-400 transition-colors">
                {safePost.author?.username || "Unknown Author"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {safePost.author?.email || ""}
              </p>
            </div>
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}