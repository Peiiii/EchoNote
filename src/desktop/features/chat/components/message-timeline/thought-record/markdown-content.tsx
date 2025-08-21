import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
    content: string;
    className?: string;
}

export function MarkdownContent({ content, className = "" }: MarkdownContentProps) {
    return (
        <div className={`prose prose-slate dark:prose-invert max-w-none ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // 自定义代码块样式
                    code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !className || !match;
                        return !isInline ? (
                            <pre className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 overflow-x-auto border border-slate-200/50 dark:border-slate-700/50">
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            </pre>
                        ) : (
                            <code className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-sm border border-slate-200/50 dark:border-slate-600/50" {...props}>
                                {children}
                            </code>
                        );
                    },
                    // 自定义链接样式
                    a({ children, href, ...props }) {
                        return (
                            <a
                                href={href}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
                                target="_blank"
                                rel="noopener noreferrer"
                                {...props}
                            >
                                {children}
                            </a>
                        );
                    },
                    // 自定义表格样式
                    table({ children, ...props }) {
                        return (
                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden" {...props}>
                                    {children}
                                </table>
                            </div>
                        );
                    },
                    th({ children, ...props }) {
                        return (
                            <th className="border border-slate-300 dark:border-slate-600 px-4 py-2 bg-slate-100 dark:bg-slate-700 font-semibold" {...props}>
                                {children}
                            </th>
                        );
                    },
                    td({ children, ...props }) {
                        return (
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2" {...props}>
                                {children}
                            </td>
                        );
                    },
                    // 自定义引用样式
                    blockquote({ children, ...props }) {
                        return (
                            <blockquote className="border-l-4 border-blue-400 dark:border-blue-500 pl-4 italic text-slate-600 dark:text-slate-400 bg-blue-50/30 dark:bg-blue-900/20 py-2 rounded-r-lg" {...props}>
                                {children}
                            </blockquote>
                        );
                    },
                    // 自定义列表样式
                    ul({ children, ...props }) {
                        return (
                            <ul className="list-disc list-inside space-y-1 marker:text-blue-500 dark:marker:text-blue-400" {...props}>
                                {children}
                            </ul>
                        );
                    },
                    ol({ children, ...props }) {
                        return (
                            <ol className="list-decimal list-inside space-y-1 marker:text-blue-500 dark:marker:text-blue-400 marker:font-medium" {...props}>
                                {children}
                            </ol>
                        );
                    },
                    // 自定义标题样式
                    h1({ children, ...props }) {
                        return (
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2" {...props}>
                                {children}
                            </h1>
                        );
                    },
                    h2({ children, ...props }) {
                        return (
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 text-blue-600 dark:text-blue-400" {...props}>
                                {children}
                            </h2>
                        );
                    },
                    h3({ children, ...props }) {
                        return (
                            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2" {...props}>
                                {children}
                            </h3>
                        );
                    },
                    h4({ children, ...props }) {
                        return (
                            <h4 className="text-base font-medium text-slate-800 dark:text-slate-200 mb-2" {...props}>
                                {children}
                            </h4>
                        );
                    },
                    h5({ children, ...props }) {
                        return (
                            <h5 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-1" {...props}>
                                {children}
                            </h5>
                        );
                    },
                    h6({ children, ...props }) {
                        return (
                            <h6 className="text-xs font-medium text-slate-800 dark:text-slate-200 mb-1" {...props}>
                                {children}
                            </h6>
                        );
                    },
                    // 自定义段落样式
                    p({ children, ...props }) {
                        return (
                            <p className="text-base leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-words font-normal mb-3" {...props}>
                                {children}
                            </p>
                        );
                    },
                    // 自定义分割线样式
                    hr({ ...props }) {
                        return (
                            <hr className="border-t border-slate-300 dark:border-slate-600 my-6" {...props} />
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
