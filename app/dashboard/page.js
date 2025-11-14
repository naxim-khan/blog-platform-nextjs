"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import DashboardStats from "@/components/dashboard/DashboardStats";
import MonthlyChart from "@/components/dashboard/MonthlyChart";
import RecentActivities from "@/components/dashboard/RecentActivities";
import RecentBlogs from "@/components/dashboard/RecentBlogs";
import BlogTable from "@/components/dashboard/BlogTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, Activity, FileText, Calendar, ArrowUp } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
    const { user, loading: authLoading } = useAuth();
    const [dashboardData, setDashboardData] = useState({
        stats: {
            totalPosts: 0,
            published: 0,
            drafts: 0
        },
        monthlyData: [],
        recentActivities: [],
        posts: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/dashboard/stats');

            if (res.ok) {
                const data = await res.json();
                setDashboardData(data);
            } else {
                console.error('Failed to fetch dashboard data');
                setDashboardData({
                    stats: { totalPosts: 0, published: 0, drafts: 0 },
                    monthlyData: [],
                    recentActivities: [],
                    posts: []
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setDashboardData({
                stats: { totalPosts: 0, published: 0, drafts: 0 },
                monthlyData: [],
                recentActivities: [],
                posts: []
            });
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-gray-700">Loading your dashboard</p>
                    <p className="text-sm text-gray-500 mt-1">Getting everything ready...</p>
                </div>
            </div>
        );
    }

    const hasData = dashboardData.posts.length > 0 || dashboardData.recentActivities.length > 0;

    return (
        <div className="min-h-screen p-3 sm:p-6 relative">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-20 right-20 w-96 h-96 bg-violet-300/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-fuchsia-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="space-y-6 sm:space-y-8">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-sm">
                                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></div>
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                                    Dashboard
                                </h1>
                                <p className="text-sm sm:text-base text-gray-600">
                                    Welcome back, <span className="font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">{user?.username}</span>!
                                    <span className="text-gray-500 text-xs sm:text-sm"> {hasData ? "Here's what's happening with your blog." : "Get started by creating your first post."}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
                        {hasData && (
                            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl px-2 py-1 sm:px-3 sm:py-1.5 border border-gray-200/50 shadow-sm">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-xs sm:text-sm font-medium text-gray-700">Live</span>
                            </div>
                        )}
                        <Link href="/dashboard/create" className="flex-1 sm:flex-none">
                            <Button className="group relative overflow-hidden flex items-center gap-2 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 text-white rounded-xl px-3 sm:px-5 py-2 sm:py-2.5 shadow-sm transition-all duration-300 w-full sm:w-auto text-sm sm:text-base">
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <Plus className="h-3 w-3 sm:h-4 sm:w-4 relative" />
                                <span className="relative">New Post</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Slim Stats Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                    <Card className="group relative bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 h-fit overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <CardContent className="px-3 sm:px-4 py-3 sm:py-4 relative">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Posts</p>
                                    <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{dashboardData.stats.totalPosts}</p>
                                    {dashboardData.stats.totalPosts > 0 && (
                                        <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                                            <ArrowUp className="h-2 w-2 sm:h-3 sm:w-3" />
                                            <span className="text-xs">Active</span>
                                        </div>
                                    )}
                                </div>
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                                    <FileText className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="group relative bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 h-fit overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <CardContent className="px-3 sm:px-4 py-3 sm:py-4 relative">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs sm:text-sm font-medium text-gray-600">Published</p>
                                    <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{dashboardData.stats.published}</p>
                                    {dashboardData.stats.published > 0 && (
                                        <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                                            <ArrowUp className="h-2 w-2 sm:h-3 sm:w-3" />
                                            <span className="text-xs">Live</span>
                                        </div>
                                    )}
                                </div>
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                                    <FileText className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="group relative bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 h-fit overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <CardContent className="px-3 sm:px-4 py-3 sm:py-4 relative">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs sm:text-sm font-medium text-gray-600">Drafts</p>
                                    <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{dashboardData.stats.drafts}</p>
                                    {dashboardData.stats.drafts > 0 && (
                                        <div className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                                            <span className="text-xs">In progress</span>
                                        </div>
                                    )}
                                </div>
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
                                    <FileText className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                    {/* Left Column - Chart & Table */}
                    <div className="xl:col-span-2 space-y-4 sm:space-y-6">
                        {/* Performance Overview */}
                        {dashboardData.monthlyData.length > 0 && (
                            <Card className="group relative bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-sm overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <CardHeader className="pb-3 relative px-4 sm:px-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                                                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base sm:text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Performance Overview</CardTitle>
                                                <CardDescription className="text-xs sm:text-sm text-gray-600">
                                                    Monthly posts analytics
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" className="rounded-xl border-gray-300/50 text-gray-700 hover:bg-gray-50 hover:border-blue-300 transition-all duration-300 text-xs sm:text-sm">
                                            View Report
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0 relative px-2 sm:px-6">
                                    <MonthlyChart data={dashboardData.monthlyData} />
                                </CardContent>
                            </Card>
                        )}

                        {/* Blog Posts Table */}
                        <Card className="group relative bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-sm overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 via-transparent to-gray-700/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <CardHeader className="pb-3 relative px-4 sm:px-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-lg flex items-center justify-center shadow-sm">
                                            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base sm:text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">All Blog Posts</CardTitle>
                                            <CardDescription className="text-xs sm:text-sm text-gray-600">
                                                Manage and view all your blog posts
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="rounded-lg px-2 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200/50 text-xs shadow-sm w-fit">
                                        {dashboardData.posts.length} posts
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="px-1 sm:px-2 relative">
                                <BlogTable posts={dashboardData.posts} onUpdate={fetchDashboardData} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Activities & Recent Blogs */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* Recent Activities */}
                        {dashboardData.recentActivities.length > 0 && (
                            <Card className="group relative bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-sm overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <CardHeader className="pb-3 relative px-4 sm:px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-sm">
                                            <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base sm:text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Recent Activity</CardTitle>
                                            <CardDescription className="text-xs sm:text-sm text-gray-600">
                                                Latest updates and actions
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0 relative px-2 sm:px-6">
                                    <RecentActivities activities={dashboardData.recentActivities} />
                                </CardContent>
                            </Card>
                        )}

                        {/* Recent Blogs */}
                        {dashboardData.posts.length > 0 && (
                            <Card className="group relative bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-sm overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <CardHeader className="pb-3 relative px-4 sm:px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
                                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base sm:text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Recent Posts</CardTitle>
                                            <CardDescription className="text-xs sm:text-sm text-gray-600">
                                                Your latest blog posts
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0 relative px-2 sm:px-6">
                                    <RecentBlogs posts={dashboardData.posts.slice(0, 3)} onUpdate={fetchDashboardData} />
                                </CardContent>
                            </Card>
                        )}

                        {/* Empty State for No Data */}
                        {!hasData && (
                            <Card className="relative bg-gradient-to-br from-purple-50/80 via-pink-50/50 to-indigo-50/80 backdrop-blur-xl rounded-2xl border border-purple-200/50 shadow-sm overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5"></div>
                                <CardContent className="p-4 sm:p-5 text-center relative">
                                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-sm">
                                            <FileText className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-amber-400 rounded-full border-2 border-white animate-pulse"></div>
                                    </div>
                                    <h3 className="text-sm sm:text-base font-semibold bg-gradient-to-r from-purple-900 to-indigo-900 bg-clip-text text-transparent mb-2">No Posts Yet</h3>
                                    <p className="text-gray-600 text-xs sm:text-sm mb-4">
                                        Get started by creating your first blog post to see your dashboard in action.
                                    </p>
                                    <Link href="/dashboard/create">
                                        <Button className="group relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 text-white rounded-xl text-xs sm:text-sm shadow-sm transition-all duration-300 w-full sm:w-auto">
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <span className="relative">Create First Post</span>
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Performance Summary - Full Width at Bottom */}
                {hasData && (
                    <Card className="relative bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 rounded-2xl shadow-sm overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
                        <CardContent className="p-4 sm:p-6 text-white relative">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-sm">
                                        <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-semibold">Performance Summary</h3>
                                        <p className="text-purple-100 text-xs sm:text-sm">Overall content performance and engagement</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 flex-1 max-w-2xl">
                                    <div className="text-center">
                                        <p className="text-xl sm:text-2xl font-bold">{dashboardData.stats.totalPosts}</p>
                                        <p className="text-purple-100 text-xs sm:text-sm">Total Posts</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl sm:text-2xl font-bold">{dashboardData.stats.published}</p>
                                        <p className="text-purple-100 text-xs sm:text-sm">Published</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl sm:text-2xl font-bold">{dashboardData.stats.drafts}</p>
                                        <p className="text-purple-100 text-xs sm:text-sm">Drafts</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl sm:text-2xl font-bold">{dashboardData.posts.length}</p>
                                        <p className="text-purple-100 text-xs sm:text-sm">Active</p>
                                    </div>
                                </div>

                                <Button variant="secondary" className="group relative overflow-hidden bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl whitespace-nowrap backdrop-blur-sm transition-all duration-300 text-sm w-full sm:w-auto mt-2 sm:mt-0">
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <span className="relative">View Detailed Analytics</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}