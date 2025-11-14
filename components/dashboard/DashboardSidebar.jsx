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
    Sparkles
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
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsMobileOpen(false);
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
        // { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, gradient: 'from-orange-500 to-red-500' },
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

    return (
        <>
            {/* Stunning Top Navbar */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 z-40 shadow-sm">
                <div className="h-full flex items-center justify-between px-4 sm:px-6">
                    {/* Left side */}
                    <div className="flex items-center gap-3">
                        {/* Mobile menu button */}
                        <button
                            onClick={toggleSidebar}
                            className="md:hidden p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-sm"
                        >
                            <Menu className="h-4 w-4 text-blue-900" />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                                <Sparkles className="h-5 w-5 text-blue-900" />
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-lg font-bold text-slate-900 dark:text-white">Dashboard</h1>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Welcome back!</p>
                            </div>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        {/* <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 relative group"
                        >
                            <Bell className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <Settings className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        </Button> */}

                        {/* User dropdown */}
                        <Link href="/dashboard/profile">
                        <div className="flex items-center gap-2 ml-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                            <Avatar className="h-8 w-8 ring-2 ring-slate-200 dark:ring-slate-700 shadow-sm">
                                <AvatarImage src={user?.avatar} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none">{user?.username}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Admin</p>
                                </div>
                        </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Overlay */}
            {isMobile && isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Stunning Sidebar */}
            <div className={cn(
                "fixed md:sticky top-16 h-[calc(100vh-4rem)] bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out z-30 shadow-sm",
                isMobile
                    ? `fixed transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} w-64`
                    : isCollapsed ? "w-20" : "w-64"
            )}>
                {/* Header Section */}
                <div className={cn(
                    "p-4 border-b border-slate-200 dark:border-slate-800 transition-all duration-300",
                    isCollapsed && "px-2"
                )}>
                    <div className={cn(
                        "flex items-center transition-all duration-300",
                        isCollapsed ? "justify-center" : "justify-between"
                    )}>
                        {!isCollapsed && (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                                    <Home className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">Navigation</h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Quick access</p>
                                </div>
                            </div>
                        )}

                        {/* Toggle Button - Only show on desktop */}
                        {!isMobile && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleSidebar}
                                className="h-8 w-8 p-0 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
                            >
                                {isCollapsed ? (
                                    <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                ) : (
                                    <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                )}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Navigation Section */}
                <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={handleLinkClick}
                                className={cn(
                                    "flex items-center group relative overflow-hidden transition-all duration-300 rounded-xl",
                                    isCollapsed ? "justify-center p-3" : "px-4 py-3 gap-3",
                                    isActive
                                        ? "bg-gradient-to-r " + item.gradient + " text-white shadow-sm scale-105"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105"
                                )}
                            >
                                {/* Icon with gradient background */}
                                <div className={cn(
                                    "flex items-center justify-center rounded-lg transition-all duration-300",
                                    isActive
                                        ? "bg-white/20 p-2"
                                        : "bg-transparent group-hover:bg-slate-200 dark:group-hover:bg-slate-700 p-2"
                                )}>
                                    <item.icon className="h-5 w-5 shrink-0" />
                                </div>

                                {!isCollapsed && (
                                    <span className="text-sm font-semibold transition-all duration-200">
                                        {item.name}
                                    </span>
                                )}

                                {/* Active indicator */}
                                {isActive && !isCollapsed && (
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                    </div>
                                )}

                                {/* Tooltip for collapsed state */}
                                {isCollapsed && (
                                    <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900 dark:bg-slate-800 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap shadow-sm">
                                        {item.name}
                                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-slate-900 dark:border-r-slate-800"></div>
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile Section */}
                {!isCollapsed && (
                    <div className="p-3 border-t border-slate-200 dark:border-slate-800">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900">
                            <div className="flex items-center gap-3 mb-3">
                                <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-slate-800 shadow-sm">
                                    <AvatarImage src={user?.avatar} />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.username}</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{user?.email}</p>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                onClick={handleLogout}
                                className="w-full justify-start text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200 rounded-lg h-9"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                <span className="text-sm font-medium">Logout</span>
                            </Button>
                        </div>
                    </div>
                )}

                {/* Collapsed Logout Button */}
                {isCollapsed && (
                    <div className="p-3 border-t border-slate-200 dark:border-slate-800">
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="w-full justify-center p-3 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200 rounded-xl group relative"
                        >
                            <LogOut className="h-5 w-5" />

                            {/* Tooltip */}
                            <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900 dark:bg-slate-800 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap shadow-sm">
                                Logout
                                <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-slate-900 dark:border-r-slate-800"></div>
                            </div>
                        </Button>
                    </div>
                )}
            </div>

            {/* Main content area spacer for top navbar */}
            <div className="h-16" />
        </>
    );
}