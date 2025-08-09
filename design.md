## Kiro Discord Presence Extension — Design

### Goal
- Build a VS Code–compatible extension that updates a user’s Discord Rich Presence while using Kiro IDE (a VS Code fork) and VS Code itself, leveraging the time‑tested approach from the community Discord Presence extension.

### References
- Discord Presence for VS Code (structure, features): [iCrawl/discord-vscode](https://github.com/iCrawl/discord-vscode)
- VS Code Extension authoring: [microsoft/vscode-docs](https://github.com/microsoft/vscode-docs)
- Packaging & publishing tool: [microsoft/vscode-vsce](https://github.com/microsoft/vscode-vsce)

### Non‑Goals
- Implementing a new Discord RPC transport. We reuse Discord IPC via named pipes/Unix sockets as in the reference.
- Tracking file contents or transmitting source code. We only derive presence metadata.

### Target Runtime and Distribution
- Runs as a classic Node extension in the local extension host (not a web extension). Declare `extensionKind: ["ui", "workspace"]` to prefer local.
- Distributed via Open VSX (ideal for forks like Kiro) and optionally VS Code Marketplace.

### High‑Level Architecture
- Activation: `onStartupFinished`, `onCommand`, and events on editor/debug sessions.
- Modules
  - AppEnvironmentDetector: resolves host info (Kiro vs VS Code) via `vscode.env.appName`, `vscode.env.uriScheme`, and `vscode.env.appHost` to set product labels, icons, and store channel (Kiro, VS Code Stable/Insiders).
  - DiscordIpcClient: minimal client for Discord IPC (pipe connect/reconnect, heartbeat). Graceful backoff and manual reconnect.
  - PresenceMapper: converts editor/debug/workspace events into Discord activity payloads (details/state/largeImageKey/smallImageKey/timestamps/buttons).
  - ActivityProviders
    - EditorActivity: file open/change, language id, workspace name.
    - DebugActivity: when a debug session starts/stops.
    - WorkspaceActivity: fallback when idle/in welcome pages.
  - SettingsStore: reads configuration and watches changes.
  - StatusBarController: quick toggle, reconnect, show/hide filename, privacy indicator.
  - Logger: gated by `kiroPresence.debug`.

### Presence Model (Discord RPC payload)
- details: "Editing <filename>" | "Browsing workspace" | "Debugging <config>"
- state: "in <workspace>" | language label
- assets:
  - largeImageKey: `kiro` when host is Kiro, `vscode` otherwise
  - largeImageText: host/version (e.g., "Kiro IDE")
  - smallImageKey: language icon key when available; else host channel key
- timestamps: `startTimestamp` for focused editor session; reset on file switch if `resetOnFileChange` setting is enabled
- buttons: optional (e.g., "View Project" to repository if `git.remote` detected and user enables buttons)

### Platform Transport
- Windows: Named pipe `\\.\pipe\discord-ipc-0..9`
- macOS/Linux: `~/.config/discord/` and variants, Unix domain socket `discord-ipc-0..9`
- Reconnect policy: exponential backoff (1s → 30s) with jitter; manual command `Kiro Presence: Reconnect`.

### Privacy & Safety
- Defaults:
  - Do not send absolute paths or repository names by default.
  - Redact filename optionally; show only language/workspace.
  - Workspace name redaction toggle.
  - Opt‑out per‑workspace and globally.
- Blocklist:
  - `kiroPresence.redactPatterns: string[]` glob patterns (e.g., `**/*.env`, `**/*secrets*`).
  - `kiroPresence.blockedWorkspaces: string[]`.

### Configuration (package.json contributes.configuration)
- `kiroPresence.enabled: boolean` — master toggle (default: true)
- `kiroPresence.showFileName: boolean` — show file name (default: false)
- `kiroPresence.showWorkspaceName: boolean` — show workspace/repo (default: false)
- `kiroPresence.idleTimeoutMs: number` — switch to idle state (default: 120000)
- `kiroPresence.buttons.enableRepositoryButton: boolean` (default: false)
- `kiroPresence.redactPatterns: string[]` — glob patterns (default: `["**/*.env", "**/*secret*", "**/.env.*"]`)
- `kiroPresence.largeImage: "auto" | "kiro" | "vscode"` (default: "auto")
- `kiroPresence.languageMap: Record<string, { smallImageKey?: string; label?: string }>` — override per language id
- `kiroPresence.debug: boolean` — verbose logs (default: false)

### Commands (package.json contributes.commands)
- `kiroPresence.toggle` — Enable/disable quickly
- `kiroPresence.reconnect` — Force reconnect to Discord IPC
- `kiroPresence.openSettings` — Open extension settings

### Events and Mapping
- on active editor change → update details/state/assets
- on document save/type → no-op for content; optionally refresh elapsed time
- on debug session start/stop → swap to debugging presence
- on window focus change → pause/resume timer

### Kiro‑specific Treatment
- Detect Kiro host via `vscode.env.appName` containing `Kiro` (and/or `process.env.VSCODE_GALLERY_SERVICE_URL` override Kiro uses). Use branding keys `largeImageKey = "kiro"` and text "Kiro IDE".
- Prefer Open VSX publishing and verify install via `kiro` distribution channel.

### Testing Strategy
- Unit: PresenceMapper, path redaction, language mapping
- Integration: mock IPC client; simulate connect, heartbeat, reconnect
- Extension host tests: `@vscode/test-electron` with `--disable-extensions` except ours; smoke open file/edit/debug

### Build & Publish
- Build: `tsc -p .`
- Package: `npx @vscode/vsce package`
- Publish (Marketplace, optional): `npx @vscode/vsce publish`
- Publish (Open VSX): `npx ovsx publish -p <token>`
- CI: GitHub Actions matrix (win/mac/linux) to build/test/package and attach VSIX to releases

### Risks & Mitigations
- Discord client not running → show status bar warning; retry
- IPC permission issues (Linux sandbox/flatpak) → document workaround and detection; link to guidance
- File privacy concerns → strict redaction defaults; visible status bar toggle

### Folder Layout
- `src/extension.ts` — activation/registration
- `src/environment/appEnvironmentDetector.ts`
- `src/ipc/discordIpcClient.ts`
- `src/presence/presenceMapper.ts`
- `src/activity/editorActivity.ts`
- `src/activity/debugActivity.ts`
- `src/ui/statusBarController.ts`
- `src/shared/logger.ts`
- `package.json` — contributes, activation events, commands, configuration
- `media/` — icons (kiro/vscode/language)

### Notes on Upstream Parity
- Functionality mirrors the proven feature set of Discord Presence for VS Code while defaulting to Kiro branding when detected. Reference feature parity and language coverage from the upstream project: [iCrawl/discord-vscode](https://github.com/iCrawl/discord-vscode).


