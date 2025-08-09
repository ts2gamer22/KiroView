import * as vscode from 'vscode';
import { DiscordIpcClient } from '../ipc/discordIpcClient';
import { AppEnvironment } from '../environment/appEnvironmentDetector';
import { buildEditorActivity } from '../presence/presenceMapper';
import { createIdleTimer } from './idleTimer';
import { createRedactor } from '../helpers/redaction';
import { readProblems } from '../helpers/problems';
import { readGitBranch } from '../helpers/gitBranch';
import { readEffectiveConfig } from '../config';
import { detectRepositoryUrl } from '../helpers/repoButton';

export type EditorActivityOptions = {
  env: AppEnvironment;
  client: DiscordIpcClient;
};

export const registerEditorActivity = ({ env, client }: EditorActivityOptions): vscode.Disposable => {
  const disposables: vscode.Disposable[] = [];

  const update = async () => {
    const cfg = readEffectiveConfig();
    const enabled = cfg.enabled;
    if (!enabled) {
      client.clearActivity();
      return;
    }

    const settings = {
      showFileName: cfg.showFileName,
      showWorkspaceName: cfg.showWorkspaceName,
      largeImage: cfg.largeImage,
      showProblems: cfg.showProblems,
      showGitBranch: cfg.showGitBranch,
      showCursorPosition: cfg.showCursorPosition,
    };

    const editor = vscode.window.activeTextEditor;
    const workspaceName = vscode.workspace.name ?? undefined;
    const redactor = createRedactor(cfg.redactPatterns);
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

    // Elapsed time
    if (cfg.showElapsedTime) {
      const now = Date.now();
      if (cfg.resetElapsedTimePerFile && editor?.document) {
        // simplistic: always restart timestamp on each update if reset per file is on
        activity.timestamps = { start: Math.floor(now / 1000) };
      } else {
        activity.timestamps = activity.timestamps ?? { start: Math.floor(now / 1000) };
      }
    }

    // Buttons
    if (cfg.buttons?.enableRepositoryButton) {
      const repoUrl = await detectRepositoryUrl();
      if (repoUrl) {
        activity.buttons = [{ label: 'View Project', url: repoUrl }];
      }
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
  const idleTimer = createIdleTimer(readEffectiveConfig().idleTimeoutMs);
  idleTimer.onIdle(() => client.setActivity({ details: 'Idle', state: vscode.workspace.name ?? undefined }));
  idleTimer.onActive(() => void update());

  disposables.push(
    vscode.window.onDidChangeWindowState((s) => (s.focused ? idleTimer.markActive() : undefined))
  );
  disposables.push(vscode.workspace.onDidChangeTextDocument(() => idleTimer.markActive()));

  // initial
  void update();

  return new vscode.Disposable(() => {
    idleTimer.dispose();
    disposables.forEach((d) => d.dispose());
  });
};



