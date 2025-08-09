import * as vscode from 'vscode';

export type KiroPresenceConfig = {
  enabled: boolean;
  discordClientId?: string;
  showFileName: boolean;
  showWorkspaceName: boolean;
  idleTimeoutMs: number;
  privacyMode: boolean;
  buttons?: { enableRepositoryButton?: boolean };
  redactPatterns: string[];
  largeImage: 'auto' | 'kiro' | 'vscode';
  showProblems?: boolean;
  showGitBranch?: boolean;
  showCursorPosition?: boolean;
  showElapsedTime?: boolean;
  resetElapsedTimePerFile?: boolean;
  debug?: boolean;
};

export const getConfig = (): vscode.WorkspaceConfiguration =>
  vscode.workspace.getConfiguration('kiroPresence');

export const readEffectiveConfig = (): KiroPresenceConfig => {
  const cfg = getConfig();
  return {
    enabled: cfg.get<boolean>('enabled', true),
    discordClientId: cfg.get<string>('discordClientId'),
    showFileName: cfg.get<boolean>('showFileName', false),
    showWorkspaceName: cfg.get<boolean>('showWorkspaceName', false),
    idleTimeoutMs: cfg.get<number>('idleTimeoutMs', 90000),
    privacyMode: cfg.get<boolean>('privacyMode', true),
    buttons: { enableRepositoryButton: cfg.get<boolean>('buttons.enableRepositoryButton', false) },
    redactPatterns: cfg.get<string[]>('redactPatterns', []),
    largeImage: cfg.get<'auto' | 'kiro' | 'vscode'>('largeImage', 'auto'),
    showProblems: cfg.get<boolean>('showProblems', false),
    showGitBranch: cfg.get<boolean>('showGitBranch', false),
    showCursorPosition: cfg.get<boolean>('showCursorPosition', false),
    showElapsedTime: cfg.get<boolean>('showElapsedTime', true),
    resetElapsedTimePerFile: cfg.get<boolean>('resetElapsedTimePerFile', false),
    debug: cfg.get<boolean>('debug', false),
  };
};


