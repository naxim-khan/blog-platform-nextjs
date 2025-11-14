// app/user/[userId]/page.js
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import { PostCard } from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, FileText, Mail, Eye, Clock, TrendingUp, BookOpen, Share2, UserPlus } from 'lucide-react';

async function getUserPosts(userId) {
  try {
    await connectDB();
    console.log('🔍 Fetching user and posts for ID:', userId);

    const user = await User.findById(userId).select('username email avatar bio createdAt').lean();
    if (!user) {
      console.log('- User not found');
      return null;
    }

    console.log('- Found user:', user.username);

    const posts = await Post.find({ 
      author: userId, 
      published: true 
    })
    .sort({ publishedAt: -1, createdAt: -1 })
    .lean();

    console.log('- Found posts:', posts.length);

    const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
    const totalReadingTime = posts.reduce((sum, post) => {
      if (!post.content) return sum + 5;
      
      let textContent = '';
      if (typeof post.content === 'string') {
        try {
          const parsed = JSON.parse(post.content);
          textContent = JSON.stringify(parsed);
        } catch {
          textContent = post.content;
        }
      } else {
        textContent = JSON.stringify(post.content);
      }
      
      const wordCount = textContent.split(/\s+/).length;
      return sum + Math.ceil(wordCount / 200);
    }, 0);

    const serializedPosts = posts.map(post => ({
      ...post,
      _id: post._id.toString(),
      author: {
        _id: user._id.toString(),
        username: user.username,
        email: user.email || '',
        avatar: user.avatar || '',
        bio: user.bio || ''
      }
    }));

    return {
      user: {
        _id: user._id.toString(),
        username: user.username,
        email: user.email || '',
        avatar: user.avatar || '',
        bio: user.bio || 'Writer at The Chronicle',
        createdAt: user.createdAt,
        stats: {
          totalPosts: posts.length,
          totalViews: totalViews,
          totalReadingTime: totalReadingTime
        }
      },
      posts: serializedPosts
    };
  } catch (error) {
    console.error('- Error fetching user posts:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { userId } = await params;
  const data = await getUserPosts(userId);

  if (!data) {
    return {
      title: 'User Not Found',
    };
  }

  return {
    title: `Posts by ${data.user.username} | The Chronicle`,
    description: `Explore all articles written by ${data.user.username} on The Chronicle. ${data.user.stats.totalPosts} articles published.`,
  };
}

export default async function UserPostsPage({ params }) {
  const { userId } = await params;
  const data = await getUserPosts(userId);

  if (!data) {
    notFound();
  }

  const { user, posts } = data;

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getJoinedDate = (dateString) => {
    if (!dateString) return 'Recently';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Elegant Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Button 
              variant="ghost" 
              asChild 
              className="group -ml-1 sm:-ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            >
              <Link href="/" className="flex items-center gap-1 sm:gap-2">
                <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors group-hover:-translate-x-0.5 sm:group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                  Back to Home
                </span>
              </Link>
            </Button>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-slate-100 dark:hover:bg-slate-800">
                <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600 dark:text-slate-400" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Profile Section with Cover */}
      <section className="relative pt-14 sm:pt-16 pb-0 overflow-hidden">
        {/* Cover Background */}
        <div className="absolute inset-0 h-52 sm:h-80 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-10" />
        </div>

        <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center pt-16 sm:pt-24 pb-6 sm:pb-8">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 ring-6 sm:ring-8 ring-white dark:ring-slate-900 shadow-sm mb-4 sm:mb-6 transition-transform hover:scale-105 duration-300">
              <AvatarImage src={user.avatar} alt={user.username} className="object-cover" />
              <AvatarFallback className="text-xl sm:text-3xl lg:text-4xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">
                {getInitials(user.username)}
              </AvatarFallback>
            </Avatar>

            {/* Profile Info */}
            <div className="text-center space-y-3 sm:space-y-4 max-w-3xl">
              <div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-black capitalize mb-2 sm:mb-3 tracking-tight">
                  {user.username}
                </h1>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center mb-3 sm:mb-4">
                  <Badge className="bg-white/20 text-black border-white/30 backdrop-blur-sm px-2.5 sm:px-4 py-1 text-xs sm:text-sm font-medium hover:bg-white/30">
                    <BookOpen className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                    Staff Writer
                  </Badge>
                  <Badge className="bg-white/20 text-black border-white/30 backdrop-blur-sm px-2.5 sm:px-4 py-1 text-xs sm:text-sm font-medium hover:bg-white/30">
                    <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                    {user.stats.totalPosts} {user.stats.totalPosts === 1 ? 'Article' : 'Articles'}
                  </Badge>
                </div>
              </div>

              {user.bio && (
                <p className="text-base sm:text-lg lg:text-xl text-black/90 leading-relaxed font-light max-w-2xl mx-auto px-2 sm:px-0">
                  {user.bio}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center pt-3 sm:pt-4">
                <Button variant="outline" className="bg-black/10 text-gray border-white/30 hover:bg-gray/20 backdrop-blur-sm font-medium px-4 sm:px-6 py-2 text-xs sm:text-sm hover:text-gray-800">
                  <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  Share Profile
                </Button>
              </div>

              {/* User Meta */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 sm:gap-6 text-xs sm:text-sm text-black/90 pt-3 sm:pt-4">
                {user.email && (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="font-medium truncate max-w-[120px] sm:max-w-none">{user.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="font-medium">Joined {getJoinedDate(user.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pb-6 sm:pb-8">
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-sm transition-all duration-300 hover:-translate-y-0.5 sm:hover:-translate-y-1">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="flex justify-center mb-2 sm:mb-3">
                  <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <FileText className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  {user.stats.totalPosts}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Articles
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-sm transition-all duration-300 hover:-translate-y-0.5 sm:hover:-translate-y-1">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="flex justify-center mb-2 sm:mb-3">
                  <div className="p-2 sm:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <Eye className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  {user.stats.totalViews > 1000 
                    ? `${(user.stats.totalViews / 1000).toFixed(1)}k`
                    : user.stats.totalViews
                  }
                </div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Total Views
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-sm transition-all duration-300 hover:-translate-y-0.5 sm:hover:-translate-y-1">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="flex justify-center mb-2 sm:mb-3">
                  <div className="p-2 sm:p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                    <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  {user.stats.totalReadingTime}+
                </div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Minutes
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-sm transition-all duration-300 hover:-translate-y-0.5 sm:hover:-translate-y-1">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="flex justify-center mb-2 sm:mb-3">
                  <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  {Math.round(user.stats.totalPosts > 0 ? user.stats.totalViews / user.stats.totalPosts : 0)}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Avg. Views
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-12 sm:py-16 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 tracking-tight">
              Published Articles
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-2 sm:px-0">
              {posts.length === 0 
                ? 'No articles published yet. Check back soon for new content!'
                : `Discover ${posts.length} insightful article${posts.length === 1 ? '' : 's'} written by ${user.username}`
              }
            </p>
          </div>

          {posts.length > 0 ? (
            <>
              {/* Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
                {posts.map((post) => (
                  <PostCard 
                    key={post._id} 
                    post={post}
                  />
                ))}
              </div>

              {/* Summary Card */}
              <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="text-center space-y-4 sm:space-y-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2">
                        Writing Impact
                      </h3>
                      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                        A snapshot of {user.username}'s contribution
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 py-4 sm:py-6 border-t border-b border-slate-200 dark:border-slate-700">
                      <div>
                        <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                          {user.stats.totalPosts}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                          Published Articles
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                          {user.stats.totalViews > 1000 
                            ? `${(user.stats.totalViews / 1000).toFixed(1)}k`
                            : user.stats.totalViews
                          }
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                          Total Readers
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                          {user.stats.totalReadingTime}+
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                          Minutes of Content
                        </div>
                      </div>
                    </div>
                    
                    <Button asChild variant="outline" className="mt-2 sm:mt-4 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm sm:text-base">
                      <Link href="/">
                        Explore More Articles
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            /* Empty State */
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-slate-900">
              <CardContent className="p-6 sm:p-12 lg:p-16 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-sm">
                  <FileText className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-slate-400 dark:text-slate-500" />
                </div>
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl mb-3 sm:mb-4 text-slate-900 dark:text-white font-bold">
                  No Articles Yet
                </CardTitle>
                <CardDescription className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 leading-relaxed">
                  {user.username} is working on something amazing. Check back later for new content, or explore other articles on our blog!
                </CardDescription>
                <Button asChild size="sm" className="sm:size-lg shadow-sm text-sm sm:text-base">
                  <Link href="/" className="flex items-center gap-1.5 sm:gap-2">
                    <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Browse All Articles
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}