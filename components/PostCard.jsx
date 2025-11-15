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
import { Calendar, Eye, Clock, ArrowUpRight, BookOpen, Sparkles } from "lucide-react";
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

  // --- Get gradient based on category ---
  const getCategoryGradient = (category) => {
    const gradients = {
      Technology: "from-blue-500/20 via-purple-500/20 to-cyan-500/20",
      Lifestyle: "from-green-500/20 via-emerald-500/20 to-teal-500/20",
      Education: "from-amber-500/20 via-orange-500/20 to-red-500/20",
      Business: "from-indigo-500/20 via-purple-500/20 to-pink-500/20",
      Health: "from-rose-500/20 via-pink-500/20 to-fuchsia-500/20",
      Travel: "from-sky-500/20 via-blue-500/20 to-cyan-500/20",
      Food: "from-orange-500/20 via-amber-500/20 to-yellow-500/20",
      Fashion: "from-fuchsia-500/20 via-purple-500/20 to-pink-500/20",
      Sports: "from-red-500/20 via-orange-500/20 to-amber-500/20",
      Art: "from-violet-500/20 via-purple-500/20 to-fuchsia-500/20",
      default: "from-blue-500/20 via-purple-500/20 to-cyan-500/20"
    };

    return gradients[category] || gradients.default;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Technology: "💻",
      Lifestyle: "🌟",
      Travel: "✈️",
      Food: "🍽️",
      "Health & Wellness": "🧘‍♂️",
      Business: "💼",
      Entertainment: "🎬",
      Education: "📚",
      Science: "🔬",
      "Arts & Culture": "🎨",

      // Extra useful blog categories
      Sports: "⚽",
      Fashion: "👗",
      Finance: "💰",
      Gaming: "🎮",
      News: "📰",

      default: "📝",
    };

    return icons[category] || icons.default;
  };


  return (
    <Card
      className={cn(
        "group cursor-pointer py-0 transition-all duration-300 hover:shadow-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden flex flex-col h-full min-h-[360px] sm:min-h-[420px] hover:border-blue-200 dark:hover:border-blue-800",
        priority && "ring-2 ring-blue-500/20",
        className
      )}
    >
      <Link href={`/blog/${safePost.slug}`} className="block h-full flex flex-col flex-1">
        <CardHeader className="p-0 flex-1">
          {/* --- Featured Image or Beautiful Fallback --- */}
          {safePost.featuredImage ? (
            <div className="relative h-36 sm:h-44 md:h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={safePost.featuredImage}
                alt={safePost.title}
                className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                loading={priority ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Category Badge */}
              {safePost.category && (
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                  <Badge
                    variant="secondary"
                    className="bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 backdrop-blur-sm text-xs font-medium px-2 py-0.5 sm:py-1 border-0"
                  >
                    {safePost.category}
                  </Badge>
                </div>
              )}

              {/* Hover Arrow Indicator */}
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full p-1 sm:p-1.5">
                  <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-700 dark:text-slate-300" />
                </div>
              </div>
            </div>
          ) : (
            /* --- Beautiful Fallback Design --- */
            <div className={`relative h-36 sm:h-44 md:h-52 w-full bg-gradient-to-br ${getCategoryGradient(safePost.category)} overflow-hidden group-hover:scale-105 transition-all duration-500`}>

              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px] animate-pulse"></div>
              </div>

              {/* Main Content */}
              <div className="relative z-10 h-full flex items-center justify-center p-4">
                {/* Central Icon */}
                <div className="text-4xl sm:text-5xl md:text-6xl transform group-hover:scale-110 transition-transform duration-300">
                  {getCategoryIcon(safePost.category)}
                </div>

                {/* Rotated Category Text - Bottom Left to Top Right */}
                {safePost.category && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="transform -rotate-45 translate-y-12 sm:translate-y-16">
                      <div className="text-4xl sm:text-5xl md:text-6xl font-black text-white/10 dark:text-black/10 tracking-widest uppercase whitespace-nowrap">
                        {safePost.category.repeat(2)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Floating Elements */}
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Sparkles className="h-4 w-4 text-white/60 animate-bounce" />
                </div>
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                  <BookOpen className="h-4 w-4 text-white/60 animate-bounce" />
                </div>
              </div>

              {/* Shine Overlay Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              {/* Category Badge - Positioned differently for fallback */}
              {safePost.category && (
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                  <Badge
                    variant="secondary"
                    className="bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 backdrop-blur-sm text-xs font-medium px-2 py-0.5 sm:py-1 border-0 shadow-lg"
                  >
                    {safePost.category}
                  </Badge>
                </div>
              )}

              {/* Hover Arrow Indicator */}
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full p-1 sm:p-1.5 shadow-lg">
                  <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-700 dark:text-slate-300" />
                </div>
              </div>
            </div>
          )}

          <CardContent className="p-3 sm:p-4 flex flex-col flex-1">
            {/* --- Tags --- */}
            {safePost.tags && safePost.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2 sm:mb-3">
                {safePost.tags.slice(0, 2).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 px-1.5 py-0 sm:px-2 border-0"
                  >
                    {tag.replace('#', '')}
                  </Badge>
                ))}
                {safePost.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0 sm:px-2 border-slate-300 dark:border-slate-600">
                    +{safePost.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}

            {/* --- Title --- */}
            <CardTitle className="text-base sm:text-lg font-bold line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 mb-1 sm:mb-2 text-slate-900 dark:text-white">
              {safePost.title}
            </CardTitle>

            {/* --- Excerpt --- */}
            {safePost.excerpt && (
              <CardDescription className="line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 mb-3 sm:mb-4 flex-1">
                {safePost.excerpt}
              </CardDescription>
            )}

            {/* --- Meta Info --- */}
            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs">
                    {formatDate(safePost.publishedAt || safePost.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs">
                    {getReadingTime(safePost.content)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs">{safePost.views || 0}</span>
              </div>
            </div>
          </CardContent>
        </CardHeader>
      </Link>

      {/* --- Author Footer --- */}
      <CardFooter className="p-3 sm:p-4 pt-2 sm:pt-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2 sm:gap-3 w-full">
          <button
            onClick={(e) => handleAuthorClick(e, safePost.author?._id)}
            className="flex items-center gap-2 sm:gap-3 w-full hover:bg-white dark:hover:bg-slate-700 rounded-lg p-1.5 sm:p-2 transition-all duration-200 group/author"
          >
            <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border border-slate-200 dark:border-slate-600 group-hover/author:border-blue-300 dark:group-hover/author:border-blue-600 transition-colors">
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