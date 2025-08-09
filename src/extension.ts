import * as vscode from 'vscode';
import { createStatusBarController } from './ui/statusBarController';
import { createLogger } from './shared/logger';
import { detectAppEnvironment } from './environment/appEnvironmentDetector';
import { DiscordIpcClient } from './ipc/discordIpcClient';
import { registerEditorActivity } from './activity/editorActivity';
import { registerDebugActivity } from './activity/debugActivity';
import { DEFAULT_DISCORD_CLIENT_ID, ENV_ALLOW_NON_KIRO, ENV_CLIENT_ID } from './constants';

let disposeAll: vscode.Disposable[] = [];
let ipcClient: DiscordIpcClient | null = null;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const config = vscode.workspace.getConfiguration('kiroPresence');
  const logger = createLogger(() => Boolean(config.get('debug')));

  const env = detectAppEnvironment();
  logger.info(`Activated in host: ${env.hostName} (${env.channel})`);

  const status = createStatusBarController();
  context.subscriptions.push(status);

  // Kiro-only enforcement (bypass for development with env)
  const allowNonKiro = process.env[ENV_ALLOW_NON_KIRO] === '1';
  if (env.hostName !== 'Kiro' && !allowNonKiro) {
    status.setConnected(false);
    vscode.window.showInformationMessage(
      'Kiro Discord Presence is Kiro-only. To run on non-Kiro during development, set env KIRO_PRESENCE_ALLOW_NON_KIRO=1 before launching.'
    );
    return;
  }

  const handleToggle = async () => {
    const current = config.get<boolean>('enabled', true);
    await config.update('enabled', !current, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage(`Kiro Presence ${!current ? 'enabled' : 'disabled'}.`);
  };

  const handleReconnect = async () => {
    if (!ipcClient) return;
    ipcClient.disconnect();
    ipcClient.connect();
    vscode.window.showInformationMessage('Kiro Presence: Reconnecting to Discord...');
  };

  const handleOpenSettings = () => {
    vscode.commands.executeCommand('workbench.action.openSettings', 'Kiro Discord Presence');
  };

  const handleTogglePrivacy = async () => {
    const c = vscode.workspace.getConfiguration('kiroPresence');
    const current = c.get<boolean>('privacyMode', true);
    await c.update('privacyMode', !current, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage(`Kiro Presence Privacy Mode ${!current ? 'enabled' : 'disabled'}.`);
  };

  const handleToggleElapsed = async () => {
    const c = vscode.workspace.getConfiguration('kiroPresence');
    const current = c.get<boolean>('showElapsedTime', true);
    await c.update('showElapsedTime', !current, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage(`Kiro Presence Elapsed Time ${!current ? 'enabled' : 'disabled'}.`);
  };

  const handleDiagnostics = () => {
    const cfg = vscode.workspace.getConfiguration('kiroPresence');
    const clientId = (cfg.get<string>('discordClientId') || '').trim();
    const appName = vscode.env.appName;
    const wsFile = vscode.workspace.workspaceFile?.fsPath ?? '(none)';
    const wsFolders = vscode.workspace.workspaceFolders?.map((f) => f.uri.fsPath).join(', ') ?? '(none)';
    vscode.window.showInformationMessage(
      `Kiro Presence Diagnostics\nClient ID: ${clientId || '(missing)'}\nHost: ${appName}\nWorkspace File: ${wsFile}\nWorkspace Folders: ${wsFolders}`,
      { modal: true }
    );
  };

  disposeAll = [
    vscode.commands.registerCommand('kiroPresence.toggle', handleToggle),
    vscode.commands.registerCommand('kiroPresence.reconnect', handleReconnect),
    vscode.commands.registerCommand('kiroPresence.openSettings', handleOpenSettings),
    vscode.commands.registerCommand('kiroPresence.diagnostics', handleDiagnostics),
    vscode.commands.registerCommand('kiroPresence.togglePrivacyMode', handleTogglePrivacy),
    vscode.commands.registerCommand('kiroPresence.toggleElapsedTime', handleToggleElapsed),
  ];

  context.subscriptions.push(...disposeAll);

  // IPC client
  const clientId = (
    config.get<string>('discordClientId') || process.env[ENV_CLIENT_ID] || DEFAULT_DISCORD_CLIENT_ID
  ).trim();
  ipcClient = new DiscordIpcClient({ clientId: clientId || DEFAULT_DISCORD_CLIENT_ID, logger });
  ipcClient.on('connected', () => status.setConnected(true));
  ipcClient.on('disconnected', () => status.setConnected(false));
  ipcClient.connect();

  // Activities
  const editorActivity = registerEditorActivity({ env, client: ipcClient });
  const debugActivity = registerDebugActivity({ env, client: ipcClient });
  context.subscriptions.push(editorActivity, debugActivity);
}

export function deactivate(): void {
  for (const d of disposeAll) d.dispose();
}


