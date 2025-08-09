## Kiro Discord Presence Extension — Task List

1) Bootstrap project scaffolding
   - Init extension with TypeScript template
   - Configure `package.json` basics (name, publisher, engines, categories)
   - Add `extensionKind: ["ui", "workspace"]`, activation events, commands
   - Set up ESLint/Prettier, tsconfig

2) Branding and assets
   - Add `media/kiro.png` (large), `media/vscode.png`, generic language icons
   - Map largeImage keys: `kiro`, `vscode`

3) Environment detection
   - Implement `AppEnvironmentDetector` to detect Kiro vs VS Code
   - Unit tests for detector outcomes

4) Discord IPC client
   - Implement minimal IPC pipe discovery and connect
   - Heartbeat, reconnect backoff with jitter
   - Commands: reconnect; surface connection state in status bar

5) Presence model + mapper
   - Define presence shape (details/state/assets/timestamps/buttons)
   - Map editor/debug/workspace events → presence
   - Implement redaction rules (filenames/workspace)
   - Tests for redaction and language label mapping

6) Activity providers
   - Editor activity provider (active editor, language, workspace)
   - Debug activity provider (start/stop events)
   - Idle detection via timeout

7) Settings & configuration
   - Contribute configuration in `package.json` per design
   - Watch for configuration changes

8) Status bar controller
   - Toggle enable/disable, quick reconnect, privacy indicator

9) Commands wiring
   - `kiroPresence.toggle`, `kiroPresence.reconnect`, `kiroPresence.openSettings`

10) Linux/Flatpak notes and diagnostics
   - Detect likely sandboxed Discord
   - Log actionable troubleshooting link

11) Telemetry & logging
   - Add optional debug logs; no remote telemetry

12) Testing
   - Unit tests for mapper, detector, IPC backoff
   - Extension host smoke tests with `@vscode/test-electron`

13) Build & package
   - `vsce package` to produce `.vsix`
   - Verify install on Kiro IDE and VS Code

14) Publishing
   - Open VSX: configure `ovsx` and token
   - Optional: VS Code Marketplace with `vsce publish`

15) CI
   - GitHub Actions: lint, test, package; attach artifact

16) Documentation
   - README with features, privacy, troubleshooting, Kiro detection
   - CHANGELOG, LICENSE

17) QA passes
   - Windows/macOS/Linux manual runs
   - Idle switch, debug detection, redaction verification

18) Release
   - Tag v0.1.0, publish to Open VSX, attach VSIX to GitHub Release


