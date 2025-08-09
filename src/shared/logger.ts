export type Logger = {
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string, error?: unknown) => void;
};

export const createLogger = (isEnabled: () => boolean): Logger => {
  const info = (message: string) => {
    if (!isEnabled()) return;
    console.log(`[KiroPresence] ${message}`);
  };
  const warn = (message: string) => {
    if (!isEnabled()) return;
    console.warn(`[KiroPresence] ${message}`);
  };
  const error = (message: string, error?: unknown) => {
    if (!isEnabled()) return;
    console.error(`[KiroPresence] ${message}`, error);
  };
  return { info, warn, error };
};


