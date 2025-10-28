declare module 'turndown' {
  export default class TurndownService {
    constructor(options?: Record<string, unknown>);
    use(plugin: unknown): void;
    turndown(html: string): string;
  }
}

declare module 'turndown-plugin-gfm' {
  export function gfm(service?: unknown): void;
}
