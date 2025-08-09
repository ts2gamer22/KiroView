import * as vscode from 'vscode';

export interface StatusBarController extends vscode.Disposable {
  setConnected(connected: boolean): void;
}

export const createStatusBarController = (): StatusBarController => {
  const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1000);
  item.name = 'Kiro Discord Presence';
  item.command = 'kiroPresence.toggle';
  item.tooltip = 'Toggle Kiro Discord Presence';
  item.text = 'Kiro Presence: $(circle-slash)';
  item.show();

  const setConnected = (connected: boolean) => {
    item.text = connected ? 'Kiro Presence: $(plug)' : 'Kiro Presence: $(circle-slash)';
  };

  const dispose = () => item.dispose();

  return { setConnected, dispose };
};


