import * as vscode from 'vscode';

export type AppEnvironment = {
  hostName: 'Kiro' | 'VS Code';
  channel: 'Stable' | 'Insiders' | 'Unknown';
  largeImageKey: 'kiro' | 'vscode';
  largeImageText: string;
};

export const detectAppEnvironment = (): AppEnvironment => {
  const appName = vscode.env.appName || '';
  const isKiro = /kiro/i.test(appName);

  const hostName: AppEnvironment['hostName'] = isKiro ? 'Kiro' : 'VS Code';
  const channel: AppEnvironment['channel'] = /insiders/i.test(appName)
    ? 'Insiders'
    : /stable|code/i.test(appName)
    ? 'Stable'
    : 'Unknown';

  const largeImageKey = isKiro ? 'kiro' : 'vscode';
  const largeImageText = isKiro ? 'Kiro IDE' : 'Visual Studio Code';

  return { hostName, channel, largeImageKey, largeImageText };
};


