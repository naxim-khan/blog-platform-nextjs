// components/Footer.js
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 dark:bg-slate-900 dark:border-slate-800">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg" />
                            <span className="text-lg font-semibold text-slate-900 dark:text-white">
                                Blog
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
                            Sharing insights and knowledge through thoughtfully crafted articles and stories.
                        </p>
                    </div>



                    {/* Newsletter */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                            Stay Updated
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Get the latest articles and insights delivered to your inbox.
                        </p>
                        <div className="flex space-x-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800/50 transition-all duration-200"
                            />
                            <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_SITE_NAME || "Blog"}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}