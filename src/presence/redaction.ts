import { Minimatch } from 'minimatch';

export type Redactor = {
  redactPath: (filePath: string | undefined) => string | undefined;
};

export const createRedactor = (patterns: string[]): Redactor => {
  const matchers = patterns.map((p) => new Minimatch(p, { dot: true, nocase: true }));
  const redactPath = (filePath: string | undefined): string | undefined => {
    if (!filePath) return filePath;
    const normalized = filePath.replace(/\\/g, '/');
    const matched = matchers.some((m) => m.match(normalized));
    return matched ? 'redacted' : filePath;
  };
  return { redactPath };
};



