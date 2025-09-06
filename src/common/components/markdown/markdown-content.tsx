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
                            <div className="my-8 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700" {...props}>
                                    {children}
                                </table>
                            </div>
                        );
                    },
                    th({ children, ...props }) {
                        return (
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-600" {...props}>
                                {children}
                            </th>
                        );
                    },
                    td({ children, ...props }) {
                        return (
                            <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100 border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150" {...props}>
                                {children}
                            </td>
                        );
                    },

                    blockquote({ children, ...props }) {
                        return (
                            <blockquote className="my-6 pl-6 py-2 italic text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 border-l-4 border-slate-300 dark:border-slate-600 rounded-r-lg [&>p:last-child]:mb-0" {...props}>
                                {children}
                            </blockquote>
                        );
                    },

                    ul({ children, ...props }) {
                        return (
                            <ul className="my-4 space-y-1.5 list-none pl-4" {...props}>
                                {children}
                            </ul>
                        );
                    },
                    li({ children, ...props }) {
                        return (
                            <li className="relative text-slate-700 dark:text-slate-300 leading-relaxed flex items-start" {...props}>
                                <span className="flex-shrink-0 w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500 mr-3 mt-2.5"></span>
                                <span className="flex-1">{children}</span>
                            </li>
                        );
                    },
                    ol({ children, ...props }) {
                        return (
                            <ol className="my-4 space-y-1.5 list-decimal list-inside pl-4 text-slate-700 dark:text-slate-300" {...props}>
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
