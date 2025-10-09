import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
// Math support: parse $...$ / $$...$$ and render via KaTeX
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // KaTeX styles for math rendering
import { CodeBlock } from "./code-block";
import { Checkbox } from "@/common/components/ui/checkbox";

interface MobileMarkdownContentProps {
  content: string;
  className?: string;
}

export function MobileMarkdownContent({ content, className = "" }: MobileMarkdownContentProps) {
  return (
    <div
      className={`prose prose-slate dark:prose-invert max-w-none [&_ul_ul]:ml-4 [&_ul_ul_ul]:ml-4 [&_ul_ul_ul_ul]:ml-4 [&_ul_ul_ul_ul_ul]:ml-4 [&_ol_ol]:ml-4 [&_ol_ol_ol]:ml-4 [&_ol_ol_ol_ol]:ml-4 [&_ol_ol_ol_ol_ol]:ml-4 [&_ul_ol]:ml-4 [&_ol_ul]:ml-4 ${className}`}
    >
      <ReactMarkdown
        // Enable GFM and math. Order matters: math first so GFM doesn't eat underscores, etc.
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code: CodeBlock,

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
                <table
                  className="min-w-full border-collapse border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden text-sm"
                  {...props}
                >
                  {children}
                </table>
              </div>
            );
          },
          th({ children, ...props }) {
            return (
              <th
                className="border border-slate-300 dark:border-slate-600 px-3 py-2 bg-slate-100 dark:bg-slate-700 font-semibold text-sm"
                {...props}
              >
                {children}
              </th>
            );
          },
          td({ children, ...props }) {
            return (
              <td
                className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
                {...props}
              >
                {children}
              </td>
            );
          },

          blockquote({ children, ...props }) {
            return (
              <blockquote
                className="border-l-4 border-blue-400 dark:border-blue-500 pl-3 italic text-slate-600 dark:text-slate-400 bg-blue-50/30 dark:bg-blue-900/20 py-2 rounded-r-lg my-3"
                {...props}
              >
                {children}
              </blockquote>
            );
          },

          ul({ children, ...props }) {
            return (
              <ul
                className="list-disc list-inside space-y-1 marker:text-blue-500 dark:marker:text-blue-400 my-3"
                {...props}
              >
                {children}
              </ul>
            );
          },
          ol({ children, ...props }) {
            return (
              <ol
                className="list-decimal list-inside space-y-1 marker:text-blue-500 dark:marker:text-blue-400 marker:font-medium my-3"
                {...props}
              >
                {children}
              </ol>
            );
          },
          input({ type, checked, ...props }) {
            if (type === "checkbox") {
              return (
                <Checkbox
                  checked={checked}
                  className="mr-2 mt-0.5 inline-block align-top"
                  disabled
                />
              );
            }
            return <input type={type} checked={checked} {...props} />;
          },

          h1({ children, ...props }) {
            return (
              <h1
                className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 mt-3 leading-6"
                {...props}
              >
                {children}
              </h1>
            );
          },
          h2({ children, ...props }) {
            return (
              <h2
                className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-2 mt-3 leading-5"
                {...props}
              >
                {children}
              </h2>
            );
          },
          h3({ children, ...props }) {
            return (
              <h3
                className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-1 mt-2 leading-5"
                {...props}
              >
                {children}
              </h3>
            );
          },
          h4({ children, ...props }) {
            return (
              <h4
                className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-1 mt-2 leading-5"
                {...props}
              >
                {children}
              </h4>
            );
          },
          h5({ children, ...props }) {
            return (
              <h5
                className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 mt-2 leading-4"
                {...props}
              >
                {children}
              </h5>
            );
          },
          h6({ children, ...props }) {
            return (
              <h6
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 mt-2 leading-4"
                {...props}
              >
                {children}
              </h6>
            );
          },

          p({ children, ...props }) {
            return (
              <p
                className="text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-words font-normal mb-3"
                {...props}
              >
                {children}
              </p>
            );
          },

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
