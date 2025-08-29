import { CodeBlock } from './code-block';
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
                    code: CodeBlock,

                    a({ children, href, ...props }) {
                        return (
                            <a
                                href={href}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors duration-200 font-medium"
                                target="_blank"
                                rel="noopener noreferrer"
                                {...props}
                            >
                                {children}
                            </a>
                        );
                    },

                    table({ children, ...props }) {
                        return (
                            <div className="my-6 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700" {...props}>
                                    {children}
                                </table>
                            </div>
                        );
                    },
                    th({ children, ...props }) {
                        return (
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800" {...props}>
                                {children}
                            </th>
                        );
                    },
                    td({ children, ...props }) {
                        return (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100 border-t border-slate-100 dark:border-slate-800" {...props}>
                                {children}
                            </td>
                        );
                    },

                    blockquote({ children, ...props }) {
                        return (
                            <blockquote className="relative my-6 pl-6 py-2 italic text-slate-700 dark:text-slate-300 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-400 dark:border-blue-500 rounded-r-lg" {...props}>
                                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-400 to-indigo-500 rounded-l-lg"></div>
                                {children}
                            </blockquote>
                        );
                    },

                    ul({ children, ...props }) {
                        return (
                            <ul className="my-4 space-y-2 list-none" {...props}>
                                {children}
                            </ul>
                        );
                    },
                    li({ children, ...props }) {
                        return (
                            <li className="flex items-start space-x-3" {...props}>
                                <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500 dark:bg-blue-400"></div>
                                <span className="text-slate-700 dark:text-slate-300">{children}</span>
                            </li>
                        );
                    },
                    ol({ children, ...props }) {
                        return (
                            <ol className="my-4 space-y-2 list-decimal list-inside" {...props}>
                                {children}
                            </ol>
                        );
                    },

                    h1({ children, ...props }) {
                        return (
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6 pb-3 border-b-2 border-gradient-to-r from-blue-500 to-purple-500 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent" {...props}>
                                {children}
                            </h1>
                        );
                    },
                    h2({ children, ...props }) {
                        return (
                            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4 mt-8 pb-2 border-b border-slate-200 dark:border-slate-700" {...props}>
                                {children}
                            </h2>
                        );
                    },
                    h3({ children, ...props }) {
                        return (
                            <h3 className="text-xl font-medium text-slate-800 dark:text-slate-200 mb-3 mt-6" {...props}>
                                {children}
                            </h3>
                        );
                    },
                    h4({ children, ...props }) {
                        return (
                            <h4 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2 mt-5" {...props}>
                                {children}
                            </h4>
                        );
                    },
                    h5({ children, ...props }) {
                        return (
                            <h5 className="text-base font-medium text-slate-800 dark:text-slate-200 mb-2 mt-4" {...props}>
                                {children}
                            </h5>
                        );
                    },
                    h6({ children, ...props }) {
                        return (
                            <h6 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-1 mt-3" {...props}>
                                {children}
                            </h6>
                        );
                    },

                    p({ children, ...props }) {
                        return (
                            <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words font-normal mb-4" {...props}>
                                {children}
                            </p>
                        );
                    },

                    hr({ ...props }) {
                        return (
                            <hr className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent" {...props} />
                        );
                    },

                    strong({ children, ...props }) {
                        return (
                            <strong className="font-semibold text-slate-900 dark:text-slate-100" {...props}>
                                {children}
                            </strong>
                        );
                    },

                    em({ children, ...props }) {
                        return (
                            <em className="italic text-slate-600 dark:text-slate-400" {...props}>
                                {children}
                            </em>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
