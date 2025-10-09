declare module 'react-syntax-highlighter' {
  import type { ComponentType, ReactNode } from 'react'
  export const Prism: ComponentType<{
    style?: any
    language?: string
    PreTag?: string | ComponentType<any>
    className?: string
    wrapLongLines?: boolean
    customStyle?: Record<string, any>
    children?: ReactNode
  }>
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  export const vscDarkPlus: any
}

