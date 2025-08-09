### Kiro Discord Presence

Discord Rich Presence for Kiro IDE (and VS Code) with privacy‑first defaults.

#### Features
- Detects Kiro vs VS Code and brands presence accordingly
- Shows editor, language, workspace (opt‑in), debug sessions
- Idle detection and manual reconnect
- Status bar toggle
- Strict redaction by default (no file contents; filenames/workspaces are opt‑in)

#### Requirements
- Desktop Discord client running (supports IPC)
- Kiro IDE or VS Code desktop

#### Quick Start (Develop locally)
1) Install deps
```bash
npm install
```
2) Build once or watch
```bash
npm run compile
# or
npm run watch
```
3) Launch the extension host
- Press F5 in VS Code/Kiro, or run the added launch configuration “Extension”.

#### Install the packaged VSIX
```bash
npm run package
# => kiro-discord-presence-*.vsix

# VS Code
code --install-extension kiro-discord-presence-*.vsix

# VS Code Insiders
code-insiders --install-extension kiro-discord-presence-*.vsix
```

#### Settings
- `kiroPresence.enabled` (boolean, default true)
- `kiroPresence.discordClientId` (string) — set your Discord application client id for custom icons/buttons
- `kiroPresence.showFileName` (boolean, default false)
- `kiroPresence.showWorkspaceName` (boolean, default false)
- `kiroPresence.idleTimeoutMs` (number, default 120000)
- `kiroPresence.buttons.enableRepositoryButton` (boolean, default false)
- `kiroPresence.redactPatterns` (string[]) — additional redact globs
- `kiroPresence.largeImage` ("auto" | "kiro" | "vscode")
- `kiroPresence.debug` (boolean)

#### Commands
- Kiro Presence: Toggle (`kiroPresence.toggle`)
- Kiro Presence: Reconnect (`kiroPresence.reconnect`)
- Kiro Presence: Open Settings (`kiroPresence.openSettings`)

#### Privacy
- No file contents or code are transmitted.
- Filenames and workspace names are disabled by default.
- Add redact globs via `kiroPresence.redactPatterns`.

#### Publish
- VS Code Marketplace (optional)
```bash
npx @vscode/vsce package
npx @vscode/vsce publish
```
- Open VSX (recommended for Kiro forks)
```bash
npx ovsx publish -p <token>
```
Docs: publishing guides in [VS Code Docs](https://github.com/microsoft/vscode-docs) and `vsce` CLI in [@vscode/vsce](https://github.com/microsoft/vscode-vsce).

#### Design & Tasks
- See `design.md` for architecture
- See `tasks.md` for execution checklist

#### Acknowledgements
- Inspired by and aligned with the structure of [iCrawl/discord-vscode](https://github.com/iCrawl/discord-vscode).


