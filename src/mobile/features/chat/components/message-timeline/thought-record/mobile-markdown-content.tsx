import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MobileMarkdownContentProps {
    content: string;
    className?: string;
}

export function MobileMarkdownContent({ content, className = "" }: MobileMarkdownContentProps) {
    return (
        <div className={`prose prose-slate dark:prose-invert max-w-none ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // 移动端优化的代码块样式
                    code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !className || !match;
                        return !isInline ? (
                            <pre className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 overflow-x-auto border border-slate-200/50 dark:border-slate-700/50 text-sm">
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
                    // 移动端优化的链接样式
                    a({ children, href, ...props }) {
                        return (
                            <a
                                href={href}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors duration-200 break-all"
                                target="_blank"
                                rel="noopener noreferrer"
                                {...props}
                            >
                                {children}
                            </a>
                        );
                    },
                    // 移动端优化的表格样式
                    table({ children, ...props }) {
                        return (
                            <div className="overflow-x-auto -mx-2 px-2">
                                <table className="min-w-full border-collapse border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden text-sm" {...props}>
                                    {children}
                                </table>
                            </div>
                        );
                    },
                    th({ children, ...props }) {
                        return (
                            <th className="border border-slate-300 dark:border-slate-600 px-3 py-2 bg-slate-100 dark:bg-slate-700 font-semibold text-sm" {...props}>
                                {children}
                            </th>
                        );
                    },
                    td({ children, ...props }) {
                        return (
                            <td className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm" {...props}>
                                {children}
                            </td>
                        );
                    },
                    // 移动端优化的引用样式
                    blockquote({ children, ...props }) {
                        return (
                            <blockquote className="border-l-4 border-blue-400 dark:border-blue-500 pl-3 italic text-slate-600 dark:text-slate-400 bg-blue-50/30 dark:bg-blue-900/20 py-2 rounded-r-lg my-3" {...props}>
                                {children}
                            </blockquote>
                        );
                    },
                    // 移动端优化的列表样式
                    ul({ children, ...props }) {
                        return (
                            <ul className="list-disc list-inside space-y-1 marker:text-blue-500 dark:marker:text-blue-400 my-3" {...props}>
                                {children}
                            </ul>
                        );
                    },
                    ol({ children, ...props }) {
                        return (
                            <ol className="list-decimal list-inside space-y-1 marker:text-blue-500 dark:marker:text-blue-400 marker:font-medium my-3" {...props}>
                                {children}
                            </ol>
                        );
                    },
                    // 移动端优化的标题样式
                    h1({ children, ...props }) {
                        return (
                            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 border-b border-slate-200 dark:border-slate-700 pb-2" {...props}>
                                {children}
                            </h1>
                        );
                    },
                    h2({ children, ...props }) {
                        return (
                            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2 text-blue-600 dark:text-blue-400" {...props}>
                                {children}
                            </h2>
                        );
                    },
                    h3({ children, ...props }) {
                        return (
                            <h3 className="text-base font-medium text-slate-800 dark:text-slate-200 mb-2" {...props}>
                                {children}
                            </h3>
                        );
                    },
                    h4({ children, ...props }) {
                        return (
                            <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2" {...props}>
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
                    // 移动端优化的段落样式
                    p({ children, ...props }) {
                        return (
                            <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-words font-normal mb-3" {...props}>
                                {children}
                            </p>
                        );
                    },
                    // 移动端优化的分割线样式
                    hr({ ...props }) {
                        return (
                            <hr className="border-t border-slate-300 dark:border-slate-600 my-4" {...props} />
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
