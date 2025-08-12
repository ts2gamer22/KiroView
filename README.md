# Kiro Activity Status

Activity status integration for Kiro IDE (and VS Code) with privacy‑first defaults.

## Features

- **Smart Host Detection**: Automatically detects Kiro vs VS Code and brands presence accordingly
- **Rich Language Support**: Shows appropriate small icons for 70+ programming languages and frameworks
- **Dynamic Presence**: Shows editor, language, workspace (opt‑in), debug sessions, and problems
- **Privacy First**: Strict redaction by default (no file contents; filenames/workspaces are opt‑in)
- **Idle Detection**: Automatically switches to idle state after configurable timeout
- **Status Bar Control**: Quick toggle, reconnect, and privacy indicator
- **Debug Integration**: Shows "Debugging <config>" during debug sessions

## Language Icons

The extension automatically maps file extensions and language IDs to Discord image assets. **You must upload these images to your Discord Developer App** under "Rich Presence" → "Art Assets" with the exact keys listed below.

### Core Technologies
- **Web**: `html`, `css`, `javascript`, `typescript`, `react-light`, `vuejs-light`, `svelte`, `angular-light`
- **Backend**: `python`, `java-light`, `csharp`, `cpp`, `c`, `golang`, `rust`, `ruby`, `php`
- **Frameworks**: `nextjs-dark`, `nuxtjs-dark`, `gatsby`, `astro`, `nestjs-dark`, `fastapi`, `django`
- **Cloud**: `aws-light`, `azure-dark`, `gcp-dark`, `cloudflare-light`
- **Tools**: `docker`, `git`, `npm`, `yarn-light`, `bun-light`, `vite-light`, `webpack-dark`

### Full List (70+ assets)
```
angular-light, appwrite, astro, aws-light, azure-dark, babel, bash-dark, 
bitbucket-dark, bootstrap, bun-light, c, cloudflare-light, cpp, cs, css, 
deno-light, discordjs-dark, django, docker, electron, emotion-dark, fastapi, 
flutter-dark, gatsby, gcp-dark, git, gitlab-dark, godot-light, golang, 
gradle-dark, graphql-dark, html, htmx-dark, java-light, javascript, 
nestjs-dark, nextjs-dark, nuxtjs-dark, r-light, rails, react-light, 
redis-dark, redux, regex-dark, rocket, rollupjs-dark, ruby, rust, sass, 
solidjs-dark, sqlite, svelte, tailwindcss-dark, tensorflow-dark, threejs-light, 
typescript, vite-light, vitest-dark, vuejs-light, webassembly, webpack-dark, 
workers-dark, yarn-light
```

## Requirements

- Desktop Discord client running (supports IPC)
- Kiro IDE or VS Code desktop
- Discord Developer App with Rich Presence assets uploaded

## Quick Start

1. **Install Extension**: Install from VS Code Marketplace or Open VSX
2. **Discord App**: Ensure Discord desktop app is running
3. **Ready to Use**: Extension works immediately with default Kiro Discord app

### For Custom Assets (Optional)
If you want to use your own Discord app with custom images:
1. **Create Discord App**: Visit [Discord Developer Portal](https://discord.com/developers/applications) → New Application
2. **Upload Assets**: Go to "Rich Presence" → "Art Assets" and upload images with the keys listed below
3. **Get Client ID**: Copy your Application ID from the General Information page
4. **Configure**: Set `kiroPresence.discordClientId` in extension settings

## Settings

### Core Settings
- `kiroPresence.enabled` (boolean, default true) - Master toggle
- `kiroPresence.discordClientId` (string, default: "1403518715407892590") - Your Discord Application Client ID. Uses default Kiro app if not changed.
- `kiroPresence.debug` (boolean, default false) - Enable verbose logging

### Privacy & Display
- `kiroPresence.showFileName` (boolean, default false) - Show active filename
- `kiroPresence.showWorkspaceName` (boolean, default false) - Show workspace/repo name
- `kiroPresence.showLanguageIcons` (boolean, default true) - Show language small images
- `kiroPresence.showCursorPosition` (boolean, default false) - Show line/column position
- `kiroPresence.showProblems` (boolean, default false) - Show error/warning counts
- `kiroPresence.showGitBranch` (boolean, default false) - Show current Git branch

### Behavior
- `kiroPresence.idleTimeoutMs` (number, default 90000) - Idle timeout in milliseconds
- `kiroPresence.largeImage` ("auto" | "kiro" | "vscode") - Large image selection
- `kiroPresence.redactPatterns` (string[]) - Glob patterns for file redaction

## Commands

- **Kiro Presence: Toggle** (`kiroPresence.toggle`) - Enable/disable quickly
- **Kiro Presence: Reconnect** (`kiroPresence.reconnect`) - Force Discord reconnection
- **Kiro Presence: Open Settings** (`kiroPresence.openSettings`) - Open extension settings
- **Kiro Presence: Diagnostics** (`kiroPresence.diagnostics`) - Show connection and config info

## Development

```bash
# Install dependencies
npm install

# Build extension
npm run compile

# Watch for changes
npm run watch

# Package VSIX
npm run package
```

## Privacy

- **No file contents** are transmitted to Discord
- **Filenames and workspace names** are disabled by default
- **Redaction patterns** can be configured via glob patterns
- **Language icons** only show the technology, not specific file details

## Publishing

- **VS Code Marketplace** (optional): `npx @vscode/vsce publish`
- **Open VSX** (recommended for Kiro): `npx ovsx publish -p <token>`

## Troubleshooting

1. **"Client ID not set"**: Set `kiroPresence.discordClientId` in settings
2. **No connection**: Ensure Discord desktop app is running and logged in
3. **No images**: Upload Rich Presence assets to your Discord app
4. **Kiro-only error**: Set env `KIRO_PRESENCE_ALLOW_NON_KIRO=1` for development

## Design & Tasks

- See `design.md` for architecture details
- See `tasks.md` for development checklist

## Acknowledgements

- Inspired by [iCrawl/discord-vscode](https://github.com/iCrawl/discord-vscode)
- Language mappings based on [leonardssh/vscord](https://github.com/leonardssh/vscord)


