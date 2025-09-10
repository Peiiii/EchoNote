import { MessageSquare } from 'lucide-react';

export const LoginHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-slate-100 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-white dark:text-slate-900" />
        </div>
        <span className="text-xl font-semibold text-slate-900 dark:text-white">EchoNote</span>
      </div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Join EchoNote</h1>
    </div>
  );
};
