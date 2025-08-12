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



  const handleReconnect = async () => {
    if (!ipcClient) return;
    ipcClient.disconnect();
    ipcClient.connect();
    vscode.window.showInformationMessage('Kiro Presence: Reconnecting to Discord...');
  };

  let connectionStatus = false;

  const handleShowStatus = async () => {
    const statusMessage = connectionStatus 
      ? '✅ Kiro Presence is connected to Discord and active!'
      : '❌ Kiro Presence is disconnected from Discord';
    
    const action = await vscode.window.showInformationMessage(
      statusMessage,
      'Open Settings',
      'Reconnect',
      'Diagnostics'
    );
    
    switch (action) {
      case 'Open Settings':
        vscode.commands.executeCommand('workbench.action.openSettings', '@ext:ts2gamer22.kiro-activity-status');
        break;
      case 'Reconnect':
        handleReconnect();
        break;
      case 'Diagnostics':
        handleDiagnostics();
        break;
    }
  };

  const handleOpenSettings = () => {
    vscode.commands.executeCommand('workbench.action.openSettings', '@ext:ts2gamer22.kiro-activity-status');
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
    vscode.commands.registerCommand('kiroPresence.showStatus', handleShowStatus),
    vscode.commands.registerCommand('kiroPresence.reconnect', handleReconnect),
    vscode.commands.registerCommand('kiroPresence.openSettings', handleOpenSettings),
    vscode.commands.registerCommand('kiroPresence.diagnostics', handleDiagnostics),
  ];

  context.subscriptions.push(...disposeAll);

  // IPC client
  const clientId = (
    config.get<string>('discordClientId') || process.env[ENV_CLIENT_ID] || DEFAULT_DISCORD_CLIENT_ID
  ).trim();
  ipcClient = new DiscordIpcClient({ clientId: clientId || DEFAULT_DISCORD_CLIENT_ID, logger });
  ipcClient.on('connected', () => {
    connectionStatus = true;
    status.setConnected(true);
  });
  ipcClient.on('disconnected', () => {
    connectionStatus = false;
    status.setConnected(false);
  });
  ipcClient.connect();

  // Activities
  const editorActivity = registerEditorActivity({ env, client: ipcClient });
  const debugActivity = registerDebugActivity({ env, client: ipcClient });
  context.subscriptions.push(editorActivity, debugActivity);
}

export function deactivate(): void {
  for (const d of disposeAll) d.dispose();
}


