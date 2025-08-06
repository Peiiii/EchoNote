import { Eye } from "lucide-react";

export const EmptyState = () => (
    <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-8">
            <div className="relative">
                {/* 背景装饰 */}
                <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 blur-xl opacity-50"></div>
                <div className="relative w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-600">
                    <Eye className="w-10 h-10 text-slate-400" />
                </div>
            </div>
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                    开始记录你的思想
                </h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed text-base">
                    在这里，每一个想法都值得被珍视。让思维自由流淌，让灵感自然涌现。
                </p>
            </div>
        </div>
    </div>
); 