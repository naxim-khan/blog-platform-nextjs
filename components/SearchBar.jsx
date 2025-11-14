"use client";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { debounce } from "@/lib/utils";

export default function SearchBar({ posts }) {
  const [query, setQuery] = useState("");

  const handleSearch = debounce((e) => {
    setQuery(e.target.value);
  }, 300);

  return (
    <div className="max-w-2xl mx-auto mb-1">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors duration-200 group-focus-within:text-blue-500" />
        <Input
          type="text"
          placeholder="Search articles, topics, or authors..."
          onChange={handleSearch}
          className="pl-12 pr-4 py-3 text-base border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
        />
      </div>
      {query && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Found {
            posts.filter(p => 
              p.title?.toLowerCase().includes(query.toLowerCase())
            ).length
          } results for "{query}"
        </p>
      )}
    </div>
  );
}
