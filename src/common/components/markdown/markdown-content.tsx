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
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors duration-150"
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
                            <div className="my-4 overflow-x-auto">
                                <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600" {...props}>
                                    {children}
                                </table>
                            </div>
                        );
                    },
                    th({ children, ...props }) {
                        return (
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600" {...props}>
                                {children}
                            </th>
                        );
                    },
                    td({ children, ...props }) {
                        return (
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600" {...props}>
                                {children}
                            </td>
                        );
                    },

                    blockquote({ children, ...props }) {
                        return (
                            <blockquote className="my-4 pl-4 py-2 italic text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/30 border-l-4 border-gray-300 dark:border-gray-600 [&>p:last-child]:mb-0" {...props}>
                                {children}
                            </blockquote>
                        );
                    },

                    ul({ children, ...props }) {
                        return (
                            <ul className="my-2 space-y-2 list-disc pl-6" {...props}>
                                {children}
                            </ul>
                        );
                    },
                    li({ children, ...props }) {
                        return (
                            <li className="text-gray-800 dark:text-gray-200 leading-relaxed" {...props}>
                                {children}
                            </li>
                        );
                    },
                    ol({ children, ...props }) {
                        return (
                            <ol className="my-2 space-y-2 list-decimal pl-6 text-gray-800 dark:text-gray-200" {...props}>
                                {children}
                            </ol>
                        );
                    },

                    h1({ children, ...props }) {
                        return (
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 mt-5 leading-7" {...props}>
                                {children}
                            </h1>
                        );
                    },
                    h2({ children, ...props }) {
                        return (
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-4 leading-6" {...props}>
                                {children}
                            </h2>
                        );
                    },
                    h3({ children, ...props }) {
                        return (
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 mt-3 leading-5" {...props}>
                                {children}
                            </h3>
                        );
                    },
                    h4({ children, ...props }) {
                        return (
                            <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2 mt-3 leading-5" {...props}>
                                {children}
                            </h4>
                        );
                    },
                    h5({ children, ...props }) {
                        return (
                            <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 mt-3 leading-5" {...props}>
                                {children}
                            </h5>
                        );
                    },
                    h6({ children, ...props }) {
                        return (
                            <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 mt-3 leading-5" {...props}>
                                {children}
                            </h6>
                        );
                    },

                    p({ children, ...props }) {
                        return (
                            <p className="text-base leading-6 text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words font-normal mb-2" {...props}>
                                {children}
                            </p>
                        );
                    },

                    hr({ ...props }) {
                        return (
                            <hr className="my-6 border-0 h-px bg-gray-300 dark:bg-gray-600" {...props} />
                        );
                    },

                    strong({ children, ...props }) {
                        return (
                            <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props}>
                                {children}
                            </strong>
                        );
                    },

                    em({ children, ...props }) {
                        return (
                            <em className="italic text-gray-700 dark:text-gray-300"  {...props}>
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
