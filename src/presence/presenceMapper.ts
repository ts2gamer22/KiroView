import * as vscode from 'vscode';
import { AppEnvironment } from '../environment/appEnvironmentDetector';
import { KNOWN_LANGUAGES } from '../data/languages';

export type PresenceSettings = {
  showFileName: boolean;
  showWorkspaceName: boolean;
  largeImage: 'auto' | 'kiro' | 'vscode';
  showProblems?: boolean;
  showGitBranch?: boolean;
  showCursorPosition?: boolean;
};

export type ActivityPayload = {
  details?: string;
  state?: string;
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  timestamps?: { start?: number };
  buttons?: { label: string; url: string }[];
};

export const buildEditorActivity = (
  env: AppEnvironment,
  settings: PresenceSettings,
  editor: vscode.TextEditor | undefined,
  workspaceName: string | undefined,
  languageSmallImage?: string
): ActivityPayload => {
  const large_image = settings.largeImage === 'auto' ? env.largeImageKey : settings.largeImage;
  const large_text = env.largeImageText;

  const fileName = editor?.document ? basename(editor.document.fileName) : undefined;
  const languageId = editor?.document?.languageId;
  const cursor = editor ? { line: editor.selection.active.line + 1, col: editor.selection.active.character + 1 } : undefined;

  const details = editor?.document
    ? settings.showFileName && fileName
      ? `Editing ${fileName}`
      : `Editing`
    : 'Browsing';

  const parts: string[] = [];
  if (settings.showWorkspaceName && workspaceName) parts.push(`in ${workspaceName}`);
  if (!settings.showWorkspaceName && languageId) parts.push(languageId);
  if (settings.showCursorPosition && cursor) parts.push(`Ln ${cursor.line}, Col ${cursor.col}`);
  const state = parts.join(' · ') || undefined;

  const small_image = languageSmallImage ?? (languageId ? KNOWN_LANGUAGES[languageId] : undefined);
  const assets = {
    large_image,
    large_text,
    small_image,
    small_text: languageId,
  };

  return { details, state, assets };
};

const basename = (p: string): string => {
  const parts = p.replace(/\\/g, '/').split('/');
  return parts[parts.length - 1] ?? p;
};



