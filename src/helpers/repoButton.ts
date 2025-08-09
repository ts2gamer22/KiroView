import * as vscode from 'vscode';

export const detectRepositoryUrl = async (): Promise<string | undefined> => {
  try {
    const git = vscode.extensions.getExtension('vscode.git');
    if (!git) return undefined;
    const api = git.isActive ? git.exports.getAPI(1) : (await git.activate()).getAPI(1);
    const repo = api.repositories[0];
    const remote = repo?.state.remotes.find((r: any) => r.name === 'origin') ?? repo?.state.remotes[0];
    const url = remote?.fetchUrl ?? remote?.pushUrl;
    if (!url) return undefined;
    // Normalize common SSH URLs to https
    if (url.startsWith('git@')) {
      const https = url.replace('git@', 'https://').replace(':', '/');
      return https.endsWith('.git') ? https.slice(0, -4) : https;
    }
    return url.endsWith('.git') ? url.slice(0, -4) : url;
  } catch {
    return undefined;
  }
};


