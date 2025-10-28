// Minimal logger service with context tagging
export const loggerService = {
  withContext(context: string) {
    const prefix = `[${context}]`;
    return {
      info: (...args: unknown[]) => console.info(prefix, ...args),
      warn: (...args: unknown[]) => console.warn(prefix, ...args),
      error: (...args: unknown[]) => console.error(prefix, ...args),
      debug: (...args: unknown[]) => console.debug(prefix, ...args),
    } as const;
  },
};

export default loggerService;
