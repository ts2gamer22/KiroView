import * as vscode from 'vscode';

export interface StatusBarController extends vscode.Disposable {
  setConnected(connected: boolean): void;
}

export const createStatusBarController = (): StatusBarController => {
  const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1000);
  item.name = 'Kiro Discord Presence';
  item.command = 'kiroPresence.showStatus';
  item.tooltip = 'Kiro Discord Presence - Click for status and settings';
  item.text = 'Kiro Presence: $(circle-slash)';
  item.show();

  let isConnected = false;

  const setConnected = (connected: boolean) => {
    isConnected = connected;
    if (connected) {
      item.text = 'Kiro Presence: $(plug)';
      item.tooltip = 'Kiro Discord Presence: Connected - Click for options';
    } else {
      item.text = 'Kiro Presence: $(circle-slash)';
      item.tooltip = 'Kiro Discord Presence: Disconnected - Click for options';
    }
  };

  const dispose = () => item.dispose();

  return { setConnected, dispose };
};


