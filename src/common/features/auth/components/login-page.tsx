import { MessageSquare } from "lucide-react";
import { LoginIllustration } from "./login-illustration";
import { LoginCard } from "./login-card";

export const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-800 flex">
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="absolute top-8 left-8 flex items-center gap-3 z-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center shadow-lg">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
            StillRoot
          </span>
        </div>

        <div className="w-full max-w-md">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-96 h-96 rounded-full bg-gradient-to-br from-emerald-100/30 to-cyan-100/30 dark:from-emerald-900/20 dark:to-cyan-900/20 animate-pulse"></div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 relative backdrop-blur-sm">
            <LoginCard />
          </div>
        </div>
      </div>

      <LoginIllustration />
    </div>
  );
};

