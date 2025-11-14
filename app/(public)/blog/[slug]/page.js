import { notFound } from 'next/navigation';
import Link from 'next/link';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import { TiptapRenderer } from '@/components/TiptapRenderer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, Eye, Clock, Share2, Bookmark } from 'lucide-react';

async function getPost(slug) {
  try {
    await connectDB();

    console.log('🔍 Looking for post with slug:', slug);

    let post;
    
    try {
      post = await Post.findOne({ slug, published: true })
        .populate({
          path: 'author',
          model: User,
          select: 'username email avatar'
        })
        .lean();
    } catch (populateError) {
      console.log(' Population failed, trying without author:', populateError.message);
      post = await Post.findOne({ slug, published: true }).lean();
    }

    if (!post) {
      console.log(' Post not found by slug, trying by ID...');
      try {
        if (slug.match(/^[0-9a-fA-F]{24}$/)) {
          post = await Post.findOne({ _id: slug, published: true }).lean();
        }
      } catch (idError) {
        console.log(' ID lookup failed:', idError.message);
      }
    }

    if (!post) {
      console.log(' Post not found');
      return null;
    }

    console.log('- Found post:', post.title);
    console.log(' Author data:', post.author);

    await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } });

    let content = post.content;
    if (typeof content === 'object' && content !== null) {
      content = JSON.stringify(content);
    }

    let authorData;
    if (post.author && typeof post.author === 'object' && post.author.username) {
      authorData = {
        _id: post.author._id?.toString() || 'unknown',
        username: post.author.username,
        email: post.author.email || '',
        avatar: post.author.avatar || ''
      };
    } else {
      if (post.author && typeof post.author === 'string') {
        try {
          const author = await User.findById(post.author).select('username email avatar').lean();
          if (author) {
            authorData = {
              _id: author._id.toString(),
              username: author.username,
              email: author.email || '',
              avatar: author.avatar || ''
            };
          }
        } catch (authorError) {
          console.log('- Failed to fetch author separately:', authorError.message);
        }
      }
      
      if (!authorData) {
        authorData = {
          _id: 'unknown',
          username: 'Unknown Author',
          email: '',
          avatar: ''
        };
      }
    }

    return {
      ...post,
      _id: post._id.toString(),
      content: content,
      author: authorData
    };
  } catch (error) {
    console.error('- Error fetching post:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt || (typeof post.content === 'string' ? post.content.substring(0, 160) : ''),
    openGraph: {
      title: post.title,
      description: post.excerpt || (typeof post.content === 'string' ? post.content.substring(0, 160) : ''),
      images: post.featuredImage ? [post.featuredImage] : [],
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author?.username || 'Unknown Author'],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content) => {
    if (!content) return '2 min';

    let textContent = '';
    if (typeof content === 'string') {
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
    return `${readingTime} min read`;
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 mt-5 sm:mt-10">
      {/* Elegant Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-xs">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Button 
              variant="ghost" 
              asChild 
              className="group -ml-1 sm:-ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            >
              <Link href="/" className="flex items-center gap-1 sm:gap-2">
                <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors group-hover:-translate-x-0.5 sm:group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                  Back to Blog
                </span>
              </Link>
            </Button>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-slate-100 dark:hover:bg-slate-800">
                <Bookmark className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600 dark:text-slate-400" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-slate-100 dark:hover:bg-slate-800">
                <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600 dark:text-slate-400" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <article className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-3 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-8 sm:mb-12 space-y-6 sm:space-y-8">
            {/* Category & Reading Time */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {post.category && post.category !== 'General' && (
                <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 px-3 py-1 sm:px-4 sm:py-1.5 text-xs font-semibold tracking-wide uppercase hover:from-blue-700 hover:to-indigo-700 shadow-sm shadow-blue-500/30">
                  {post.category}
                </Badge>
              )}
              <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="font-medium">{getReadingTime(post.content)}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="font-medium">{post.views || 0} views</span>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                {post.excerpt}
              </p>
            )}

            {/* Author & Meta */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-800">
              <Link href={`/user/${post.author?._id}`} className="flex items-center gap-2 sm:gap-3 group w-full sm:w-auto">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-slate-200 dark:ring-slate-700 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 transition-transform group-hover:scale-105">
                  <AvatarImage
                    src={post.author?.avatar}
                    alt={post.author?.username}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-xs sm:text-sm">
                    {getInitials(post.author?.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm sm:text-base truncate">
                    {post.author?.username}
                  </p>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    <time dateTime={post.publishedAt || post.createdAt} className="truncate">
                      {formatDate(post.publishedAt || post.createdAt)}
                    </time>
                  </div>
                </div>
              </Link>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-3 sm:pt-4">
                {post.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    #{tag.replace('#', '')}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative mb-8 sm:mb-12 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm shadow-slate-900/10 dark:shadow-black/30 group">
              <div className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          )}

          {/* Content Section */}
          <div className="prose prose-sm sm:prose-lg prose-slate dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-2xl sm:prose-h1:text-4xl prose-h1:mb-4 sm:prose-h1:mb-6 prose-h1:mt-8 sm:prose-h1:mt-12
            prose-h2:text-xl sm:prose-h2:text-3xl prose-h2:mb-3 sm:prose-h2:mb-5 prose-h2:mt-6 sm:prose-h2:mt-10
            prose-h3:text-lg sm:prose-h3:text-2xl prose-h3:mb-2 sm:prose-h3:mb-4 prose-h3:mt-4 sm:prose-h3:mt-8
            prose-p:text-base sm:prose-p:text-lg prose-p:leading-7 sm:prose-p:leading-8 prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:mb-4 sm:prose-p:mb-6
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline prose-a:font-medium hover:prose-a:underline
            prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-semibold
            prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1 sm:prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-slate-900 dark:prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 prose-pre:shadow-sm prose-pre:text-sm sm:prose-pre:text-base
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-900 prose-blockquote:py-2 prose-blockquote:px-4 sm:prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:font-normal
            prose-ul:my-4 sm:prose-ul:my-6 prose-ol:my-4 sm:prose-ol:my-6
            prose-li:text-slate-700 dark:prose-li:text-slate-300 prose-li:my-1 sm:prose-li:my-2
            prose-img:rounded-lg sm:prose-img:rounded-xl prose-img:shadow-sm">
            <Card className="border-0 shadow-none bg-transparent p-0">
              <CardContent className="p-0">
                <TiptapRenderer
                  content={post.content}
                  className="min-h-[300px] sm:min-h-[400px]"
                />
              </CardContent>
            </Card>
          </div>

          {/* Author Bio Card */}
          <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-slate-200 dark:border-slate-800">
            <Card className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-3 sm:ring-4 ring-white dark:ring-slate-800 shadow-sm shrink-0">
                    <AvatarImage
                      src={post.author?.avatar}
                      alt={post.author?.username}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg sm:text-xl font-bold">
                      {getInitials(post.author?.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2 sm:space-y-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1">
                        Written by {post.author?.username}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                        Published on {formatDate(post.publishedAt || post.createdAt)}
                      </p>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                      Content creator and writer sharing insights and stories. Follow for more articles on technology, creativity, and innovation.
                    </p>
                    {/* <Link href="/blog/">
                      <Button 
                      variant="outline" 
                      size="sm"
                      className="mt-1 sm:mt-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs sm:text-sm"
                    >
                      View Profile
                    </Button>
                    </Link> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Related Articles Placeholder */}
          <div className="mt-12 sm:mt-16">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
              More Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Placeholder for related articles */}
              <Link href="/" className="group block">
                <Card className="overflow-hidden border-slate-200 dark:border-slate-800 hover:shadow-sm transition-all duration-300 hover:-translate-y-0.5 sm:hover:-translate-y-1">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700" />
                    <div className="p-4 sm:p-5">
                      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 text-sm sm:text-base">
                        Continue Reading More Articles
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 sm:mt-2">
                        Explore more content
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}