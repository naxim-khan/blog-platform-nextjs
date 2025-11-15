// app/posts/PostsClient.jsx (Client Component)
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { useRouter } from "next/navigation";

export function PostsClient({ currentPage, hasMore, searchQuery, categoryFilter, totalPosts }) {
  const router = useRouter();

  const loadNextPage = () => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('q', searchQuery);
    if (categoryFilter) params.set('category', categoryFilter);
    params.set('page', (currentPage + 1).toString());
    
    router.push(`/posts?${params.toString()}`, { scroll: false });
  };

  if (!hasMore) {
    return (
      <div className="text-center mt-12 xs:mt-16">
        <p className="text-slate-500 text-lg">
          You've reached the end! {totalPosts} article{totalPosts === 1 ? '' : 's'} total.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center mt-12 xs:mt-16">
      <Button 
        onClick={loadNextPage}
        className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 xs:px-12 py-4 xs:py-6 text-base xs:text-lg font-semibold rounded-xl hover:scale-105 transition-all duration-300 group"
      >
        Load More Articles
        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
      </Button>
      <p className="text-slate-500 text-sm mt-4">
        Showing {currentPage * 9} of {totalPosts} articles
      </p>
    </div>
  );
}