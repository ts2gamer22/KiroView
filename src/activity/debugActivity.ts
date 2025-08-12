import * as vscode from 'vscode';
import { DiscordIpcClient } from '../ipc/discordIpcClient';
import { AppEnvironment } from '../environment/appEnvironmentDetector';

export type DebugActivityOptions = {
  env: AppEnvironment;
  client: DiscordIpcClient;
};

export const registerDebugActivity = ({ env, client }: DebugActivityOptions): vscode.Disposable => {
  const disposables: vscode.Disposable[] = [];

  const updateDebug = (session: vscode.DebugSession | undefined) => {
    const cfg = vscode.workspace.getConfiguration('kiroPresence');
    const enabled = cfg.get<boolean>('enabled', true);
    if (!enabled) return;

    if (session) {
      client.setActivity({
        details: `Debugging ${session.name}`,
        state: vscode.workspace.name ?? undefined,
        assets: { large_image: env.largeImageKey, large_text: env.largeImageText },
      });
    }
  };

  disposables.push(
    vscode.debug.onDidStartDebugSession((s) => updateDebug(s)),
    vscode.debug.onDidTerminateDebugSession(() => {
      // Let editor activity provider refresh the presence next.
    })
  );

  return new vscode.Disposable(() => disposables.forEach((d) => d.dispose()));
};



