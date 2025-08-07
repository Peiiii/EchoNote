import { PenTool, Sparkles } from "lucide-react";

export const EmptyState = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] px-8 text-center">
            {/* Enhanced visual elements */}
            <div className="relative mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-400/20 dark:to-purple-400/20 rounded-2xl flex items-center justify-center mb-4">
                    <PenTool className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                </div>
            </div>
            
            {/* Enhanced content */}
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                Start Your Thought Journey
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md leading-relaxed mb-6">
                Capture your ideas, insights, and reflections. Every thought matters in your creative journey.
            </p>
            
            {/* Interactive elements */}
            <div className="flex flex-col sm:flex-row gap-3">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-sm">
                    Write Your First Thought
                </button>
                <button className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-all duration-200 hover:scale-105">
                    Explore Examples
                </button>
            </div>
            
            {/* Subtle decorative elements */}
            <div className="mt-8 flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                <span className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                    <span>Private & Secure</span>
                </span>
                <span className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                    <span>AI-Powered Insights</span>
                </span>
            </div>
        </div>
    );
}; 