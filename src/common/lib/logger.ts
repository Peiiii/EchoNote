// Minimal logger service with context tagging
export const loggerService = {
  withContext(context: string) {
    const prefix = `[${context}]`;
    return {
      info: (...args: any[]) => console.info(prefix, ...args),
      warn: (...args: any[]) => console.warn(prefix, ...args),
      error: (...args: any[]) => console.error(prefix, ...args),
      debug: (...args: any[]) => console.debug(prefix, ...args),
    } as const;
  },
};

export default loggerService;

