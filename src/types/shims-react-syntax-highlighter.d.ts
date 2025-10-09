declare module 'react-syntax-highlighter' {
  import type { ComponentType, ReactNode } from 'react'
  type SyntaxHighlighterProps = {
    style?: unknown
    language?: string
    PreTag?: string | ComponentType<unknown>
    className?: string
    wrapLongLines?: boolean
    customStyle?: Record<string, unknown>
    children?: ReactNode
  }
  export const Prism: ComponentType<SyntaxHighlighterProps>
  export const PrismLight: ComponentType<SyntaxHighlighterProps> & {
    registerLanguage: (name: string, syntax: unknown) => void
  }
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  export const vscDarkPlus: unknown
}

declare module 'react-syntax-highlighter/dist/esm/languages/prism/*' {
  const lang: unknown
  export default lang
}
