"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
    LayoutDashboard,
    FileText,
    Plus,
    User,
    BarChart3,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Home,
    Menu,
    Settings,
    Bell,
    Sparkles,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) {
                setIsMobileOpen(false);
            }
            // Auto-collapse sidebar on mobile
            if (mobile) {
                setIsCollapsed(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, gradient: 'from-blue-500 to-indigo-500' },
        { name: 'All Posts', href: '/dashboard/posts', icon: FileText, gradient: 'from-purple-500 to-pink-500' },
        { name: 'Create Post', href: '/dashboard/create', icon: Plus, gradient: 'from-green-500 to-emerald-500' },
        { name: 'Profile', href: '/dashboard/profile', icon: User, gradient: 'from-cyan-500 to-blue-500' },
    ];

    const handleLogout = async () => {
        await logout();
        router.push('/auth/login');
    };

    const toggleSidebar = () => {
        if (isMobile) {
            setIsMobileOpen(!isMobileOpen);
        } else {
            setIsCollapsed(!isCollapsed);
        }
    };

    const handleLinkClick = () => {
        if (isMobile) {
            setIsMobileOpen(false);
        }
    };

    // Close sidebar when clicking on overlay
    const handleOverlayClick = () => {
        setIsMobileOpen(false);
    };

    return (
        <>
            {/* Enhanced Mobile Top Navbar */}
            <div className="fixed top-0 left-0 right-0 h-14 sm:h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 z-50 shadow-sm">
                <div className="h-full flex items-center justify-between px-3 sm:px-4 md:px-6">
                    {/* Left side - Logo and Menu */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Mobile menu button */}
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-sm active:scale-95"
                        >
                            {isMobileOpen ? (
                                <X className="h-4 w-4 text-white" />
                            ) : (
                                <Menu className="h-4 w-4 text-white" />
                            )}
                        </button>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            </div>
                            <div className="hidden xs:block">
                                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">Dashboard</h1>
                                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">Welcome back!</p>
                            </div>
                        </div>
                    </div>

                    {/* Right side - User info */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        {/* User avatar - Compact on mobile */}
                        <Link href="/dashboard/profile" className="flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95">
                            <Avatar className="h-7 w-7 sm:h-8 sm:w-8 ring-2 ring-slate-200 dark:ring-slate-700 shadow-sm flex-shrink-0">
                                <AvatarImage src={user?.avatar} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs sm:text-sm font-semibold">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden sm:block min-w-0">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none truncate max-w-[120px]">{user?.username}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[120px]">Admin</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Enhanced Mobile Overlay */}
            {isMobile && isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
                    onClick={handleOverlayClick}
                />
            )}

            {/* Enhanced Stunning Sidebar */}
            <div className={cn(
                "fixed md:sticky top-14 sm:top-16 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out z-40 shadow-lg",
                isMobile
                    ? `fixed transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} w-[85vw] max-w-sm`
                    : isCollapsed ? "w-16 sm:w-20" : "w-64"
            )}>
                {/* Header Section - Enhanced for Mobile */}
                <div className={cn(
                    "p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 transition-all duration-300 bg-white dark:bg-slate-900",
                    isCollapsed && "px-2 sm:px-3"
                )}>
                    <div className={cn(
                        "flex items-center transition-all duration-300",
                        isCollapsed ? "justify-center" : "justify-between"
                    )}>
                        {!isCollapsed && (
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                                    <Home className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate">Navigation</h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">Quick access</p>
                                </div>
                            </div>
                        )}

                        {/* Toggle Button - Only show on desktop */}
                        {!isMobile && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleSidebar}
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 active:scale-95"
                            >
                                {isCollapsed ? (
                                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600 dark:text-slate-400" />
                                ) : (
                                    <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600 dark:text-slate-400" />
                                )}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Enhanced Navigation Section - Mobile Optimized */}
                <nav className="flex-1 p-2 sm:p-3 space-y-1 sm:space-y-2 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={handleLinkClick}
                                className={cn(
                                    "flex items-center group relative overflow-hidden transition-all duration-200 rounded-xl active:scale-95",
                                    isCollapsed ? "justify-center p-2 sm:p-3" : "px-3 sm:px-4 py-2.5 sm:py-3 gap-2 sm:gap-3",
                                    isActive
                                        ? "bg-gradient-to-r " + item.gradient + " text-white shadow-sm"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                )}
                            >
                                {/* Icon with gradient background */}
                                <div className={cn(
                                    "flex items-center justify-center rounded-lg transition-all duration-300 flex-shrink-0",
                                    isActive
                                        ? "bg-white/20 p-1.5 sm:p-2"
                                        : "bg-transparent group-hover:bg-slate-200 dark:group-hover:bg-slate-700 p-1.5 sm:p-2",
                                    isCollapsed ? "w-8 h-8" : "w-9 h-9 sm:w-10 sm:h-10"
                                )}>
                                    <item.icon className={cn(
                                        "transition-all duration-200",
                                        isCollapsed ? "h-4 w-4" : "h-4 w-4 sm:h-5 sm:w-5"
                                    )} />
                                </div>

                                {!isCollapsed && (
                                    <span className="text-sm font-semibold transition-all duration-200 truncate flex-1">
                                        {item.name}
                                    </span>
                                )}

                                {/* Active indicator */}
                                {isActive && !isCollapsed && (
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse flex-shrink-0"></div>
                                    </div>
                                )}

                                {/* Enhanced Tooltip for collapsed state */}
                                {isCollapsed && (
                                    <div className="absolute left-full ml-2 px-2 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap shadow-sm border border-slate-700">
                                        {item.name}
                                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-slate-900 dark:border-r-slate-800"></div>
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Enhanced User Profile Section */}
                {!isCollapsed && (
                    <div className="p-2 sm:p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900">
                            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 ring-2 ring-white dark:ring-slate-800 shadow-sm flex-shrink-0">
                                    <AvatarImage src={user?.avatar} />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate text-xs sm:text-sm">{user?.username}</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate hidden sm:block">{user?.email}</p>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                onClick={handleLogout}
                                className="w-full justify-start text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200 rounded-lg h-8 sm:h-9 text-xs sm:text-sm active:scale-95"
                            >
                                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                                <span className="font-medium truncate">Logout</span>
                            </Button>
                        </div>
                    </div>
                )}

                {/* Enhanced Collapsed Logout Button */}
                {isCollapsed && (
                    <div className="p-2 sm:p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="w-full justify-center p-2 sm:p-3 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200 rounded-xl group relative active:scale-95"
                        >
                            <LogOut className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />

                            {/* Enhanced Tooltip */}
                            <div className="absolute left-full ml-2 px-2 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap shadow-sm border border-slate-700">
                                Logout
                                <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-slate-900 dark:border-r-slate-800"></div>
                            </div>
                        </Button>
                    </div>
                )}
            </div>

            {/* Main content area spacer for top navbar */}
            <div className="h-14 sm:h-16" />
        </>
    );
}