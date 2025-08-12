import * as vscode from 'vscode';
import { DiscordIpcClient } from '../ipc/discordIpcClient';
import { AppEnvironment } from '../environment/appEnvironmentDetector';
import { buildEditorActivity } from '../presence/presenceMapper';
import { createIdleTimer } from './idleTimer';
import { createRedactor } from '../presence/redaction';
import { readProblems } from '../presence/problems';
import { readGitBranch } from '../presence/gitBranch';

export type EditorActivityOptions = {
  env: AppEnvironment;
  client: DiscordIpcClient;
};

export const registerEditorActivity = ({ env, client }: EditorActivityOptions): vscode.Disposable => {
  const disposables: vscode.Disposable[] = [];

  const update = async () => {
    const cfg = vscode.workspace.getConfiguration('kiroPresence');
    const enabled = cfg.get<boolean>('enabled', true);
    if (!enabled) {
      client.clearActivity();
      return;
    }

    const settings = {
      showFileName: cfg.get<boolean>('showFileName', false),
      showWorkspaceName: cfg.get<boolean>('showWorkspaceName', false),
      largeImage: cfg.get<'auto' | 'kiro' | 'vscode'>('largeImage', 'auto'),
      showProblems: cfg.get<boolean>('showProblems', false),
      showGitBranch: cfg.get<boolean>('showGitBranch', false),
      showCursorPosition: cfg.get<boolean>('showCursorPosition', false),
      showLanguageIcons: cfg.get<boolean>('showLanguageIcons', true),
    };

    const editor = vscode.window.activeTextEditor;
    const workspaceName = vscode.workspace.name ?? undefined;
    const redactor = createRedactor(cfg.get<string[]>('redactPatterns', []));
    const activity = buildEditorActivity(env, settings, editor, workspaceName);
    
    // Apply simple redaction of filename if pattern matched
    if (!settings.showFileName && editor?.document) {
      // nothing to do, hidden by setting
    } else if (editor?.document) {
      const redacted = redactor.redactPath(editor.document.fileName);
      if (redacted === 'redacted') {
        activity.details = 'Editing';
      }
    }
    
    // Problems
    if (settings.showProblems) {
      const { errors, warnings } = readProblems();
      const suffix = `errors ${errors}, warnings ${warnings}`;
      activity.state = activity.state ? `${activity.state} · ${suffix}` : suffix;
    }

    // Git branch
    if (settings.showGitBranch) {
      const branch = await readGitBranch();
      if (branch) activity.state = activity.state ? `${activity.state} · ${branch}` : branch;
    }

    client.setActivity(activity as unknown as Record<string, unknown>);
  };

  disposables.push(vscode.window.onDidChangeActiveTextEditor(update));
  disposables.push(vscode.workspace.onDidOpenTextDocument(update));
  disposables.push(vscode.workspace.onDidCloseTextDocument(update));
  disposables.push(vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('kiroPresence')) update();
  }));

  // idle handling
  const idleTimeout = vscode.workspace.getConfiguration('kiroPresence').get<number>('idleTimeoutMs', 90000);
  const idleTimer = createIdleTimer(idleTimeout);
  idleTimer.onIdle(() => {
    const cfg = vscode.workspace.getConfiguration('kiroPresence');
    const showWorkspaceName = cfg.get<boolean>('showWorkspaceName', false);
    const state = showWorkspaceName ? vscode.workspace.name ?? undefined : undefined;
    client.setActivity({ details: 'Idle', state });
  });
  idleTimer.onActive(update);

  disposables.push(
    vscode.window.onDidChangeWindowState((s) => (s.focused ? idleTimer.markActive() : undefined))
  );
  disposables.push(vscode.workspace.onDidChangeTextDocument(() => idleTimer.markActive()));

  // initial
  update();

  return new vscode.Disposable(() => {
    idleTimer.dispose();
    disposables.forEach((d) => d.dispose());
  });
};



