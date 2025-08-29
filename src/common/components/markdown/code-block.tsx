import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeBlockProps {
    className?: string;
    children?: React.ReactNode;
}

export function CodeBlock({ className, children }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const isInline = !className || !match;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(String(children));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    if (isInline) {
        return (
            <code className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded-md text-sm font-mono border border-slate-200 dark:border-slate-700">
                {children}
            </code>
        );
    }

    return (
        <div className="group relative my-6">
            <div className="flex items-center justify-between bg-slate-800 dark:bg-slate-900 border-b border-slate-700 dark:border-slate-600 rounded-t-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                    {language && (
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                            {language}
                        </span>
                    )}
                </div>
                <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-2 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-700 hover:bg-slate-600 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                    title="Copy code"
                >
                    {copied ? (
                        <>
                            <Check className="w-3 h-3" />
                            <span>Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            <pre className="bg-slate-900 dark:bg-slate-950 rounded-b-lg p-4 overflow-x-auto border border-slate-700 dark:border-slate-600">
                <code className={`${className} text-sm leading-relaxed font-mono text-slate-100 dark:text-slate-200`}>
                    {children}
                </code>
            </pre>

            <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-l-lg"></div>
        </div>
    );
}
