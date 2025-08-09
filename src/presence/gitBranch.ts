import * as vscode from 'vscode';

export const readGitBranch = async (): Promise<string | undefined> => {
  try {
    const git = vscode.extensions.getExtension('vscode.git');
    if (!git) return undefined;
    const api = git.isActive ? git.exports.getAPI(1) : (await git.activate()).getAPI(1);
    const repo = api.repositories[0];
    const branch = repo?.state.HEAD?.name;
    return branch ?? undefined;
  } catch {
    return undefined;
  }
};


