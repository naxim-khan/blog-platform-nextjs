// components/Navbar.js
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, X, PenTool } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <nav className={cn(
      "sticky top-0 z-50 transition-all duration-300 backdrop-blur-md",
      isScrolled
        ? "bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800/80"
        : "bg-transparent border-b border-transparent"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                <PenTool className="h-4 w-4 text-white" />
              </div>
            </div>
            <span className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
              Blog
            </span>
          </Link>

          {/* Desktop Navigation */}


          {/* Desktop Search & Actions */}
          <Link href="/auth/login">
            <div className="hidden md:flex items-center space-x-3">

              <Button
                size="sm"
                className="h-9 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >

                Sign In
                {/* </Link> */}
              </Button>
            </div>
          </Link>
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors duration-200"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            ) : (
              <Menu className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3">
            
            <Link href="/auth/login">
              <div className="flex items-center space-x-3">

                <Button
                  size="sm"
                  className="h-9 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >

                  Sign In
                  {/* </Link> */}
                </Button>
              </div>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}