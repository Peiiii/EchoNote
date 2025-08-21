import { MarkdownContent } from "./markdown-content";

const sampleMarkdown = `# Markdown 渲染演示

这是一个 **Markdown** 渲染功能的演示。

## 功能特性

- ✅ **粗体文本**
- ✅ *斜体文本*
- ✅ \`行内代码\`
- ✅ [链接](https://example.com)
- ✅ 列表支持

## 代码块

\`\`\`typescript
function hello() {
    console.log("Hello, Markdown!");
}
\`\`\`

## 表格

| 功能 | 状态 | 说明 |
|------|------|------|
| 标题 | ✅ | 支持 H1-H6 |
| 列表 | ✅ | 有序和无序列表 |
| 代码 | ✅ | 行内和块级代码 |
| 链接 | ✅ | 自动打开新标签页 |

## 引用

> 这是一个引用块，可以用来突出重要的信息。

## 分割线

---

现在你可以使用 Markdown 语法来编写更丰富的笔记内容了！
`;

export function MarkdownDemo() {
    return (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
                Markdown 渲染功能演示
            </h2>
            <MarkdownContent content={sampleMarkdown} />
        </div>
    );
}
