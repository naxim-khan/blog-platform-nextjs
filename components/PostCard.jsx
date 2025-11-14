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
import { Calendar, Eye, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function PostCard({ post, className, priority = false }) {
  const router = useRouter();

  // --- 🧩 Ensure post is plain JSON-safe (fallback in case API didn’t serialize) ---
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
        "group cursor-pointer transition-all duration-300 hover:shadow-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 overflow-hidden",
        priority && "ring-1 ring-blue-500/10",
        className
      )}
    >
      <Link href={`/blog/${safePost.slug}`} className="block h-full">
        <CardHeader className="p-0">
          {/* --- Featured Image --- */}
          {safePost.featuredImage ? (
            <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
              <img
                src={safePost.featuredImage}
                alt={safePost.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading={priority ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {safePost.category && (
                <div className="absolute top-3 left-3">
                  <Badge
                    variant="secondary"
                    className="bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 backdrop-blur-sm text-xs font-medium px-2 py-1"
                  >
                    {safePost.category}
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            <div className="h-48 w-full bg-gradient-to-br from-blue-500/5 to-sky-500/5 dark:from-blue-500/10 dark:to-sky-500/10 flex items-center justify-center group-hover:from-blue-500/10 group-hover:to-sky-500/10 transition-all duration-300">
              <div className="text-3xl text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition-colors">
                📝
              </div>
            </div>
          )}

          <div className="p-4">
            {/* --- Tags --- */}
            {safePost.tags && safePost.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {safePost.tags.slice(0, 2).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5"
                  >
                    {tag}
                  </Badge>
                ))}
                {safePost.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    +{safePost.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}

            {/* --- Title --- */}
            <CardTitle className="text-lg font-semibold line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 mb-2 text-slate-900 dark:text-white">
              {safePost.title}
            </CardTitle>

            {/* --- Excerpt --- */}
            {safePost.excerpt && (
              <CardDescription className="line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400 mb-3">
                {safePost.excerpt}
              </CardDescription>
            )}

            {/* --- Meta Info --- */}
            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="text-xs">
                    {formatDate(safePost.publishedAt || safePost.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-xs">
                    {getReadingTime(safePost.content)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                <span className="text-xs">{safePost.views || 0}</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Link>

      {/* --- Author Footer --- */}
      <CardFooter className="p-4 pt-2 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={(e) => handleAuthorClick(e, safePost.author?._id)}
            className="flex items-center gap-3 w-full hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg p-2 transition-colors duration-200"
          >
            <Avatar className="h-7 w-7 border border-slate-200 dark:border-slate-600">
              <AvatarImage
                src={safePost.author?.avatar}
                alt={safePost.author?.username}
                className="transition-transform duration-200 group-hover:scale-110"
              />
              <AvatarFallback className="text-xs bg-slate-100 dark:bg-slate-700">
                {getInitials(safePost.author?.username)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
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
