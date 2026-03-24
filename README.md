# Tailnote Jump

Tailnote Jump helps you navigate markdown numeric references.
When your cursor is on `[num]`, the extension jumps to the tailnote target in the same file.

## What It Does

This extension provides three capabilities in Markdown files:

- Jump: go to tailnote target.
- Peek: open tailnote target in peek view.
- Hover: preview target tailnote line on mouse hover.

## Matching Rule

When cursor is on `[num]`:

1. Search current file for tailnote-like lines that start with `[num]` (optional leading spaces), and where `[num]` is followed by whitespace, end-of-line, `:`, or `：`.
2. Use the last such match as the target.
3. If no tailnote-like line exists, fallback to the last `[num]` occurrence in the file.
4. If cursor is already on the target, no jump is performed.

Examples considered as tailnote-like lines:

```md
[1] tailnote text
   [1] tailnote text
[1]: tailnote text
```

## Install In VS Code

### Option A: Install from VSIX in VS Code UI

1. Open VS Code.
2. Open Extensions view (`Ctrl+Shift+X`).
3. Click the `...` menu in Extensions panel.
4. Choose `Install from VSIX...`.
5. Select your package file, for example:
   `F:\tests\plugin\tailnote-jump-0.0.1.vsix`
6. Run `Developer: Reload Window` after install.

### Option B: Install from command line

```powershell
code --install-extension "F:\tests\plugin\tailnote-jump-0.0.1.vsix" --force
```

### Install to a custom global extensions directory

If you do not want the default extensions location:

```powershell
code --extensions-dir "D:\VSCodeExtensions" --install-extension "F:\tests\plugin\tailnote-jump-0.0.1.vsix" --force
```

Important: start VS Code with the same `--extensions-dir` to use extensions from that directory.

```powershell
code --extensions-dir "D:\VSCodeExtensions"
```

## Commands And Keybindings

- `Tailnote Jump: Jump To Tailnote`
  - Windows/Linux: `Ctrl+Shift+J`
  - macOS: `Cmd+Shift+J`
- `Tailnote Jump: Peek Tailnote`
  - Windows/Linux: `Ctrl+Shift+Alt+J`
  - macOS: `Cmd+Shift+Alt+J`

Also supported through DefinitionProvider:

- `F12` (Go to Definition)
- `Alt+F12` (Peek Definition)
- `Ctrl/Cmd + Click`

## Quick Test

Use this markdown sample:

```md
Body mention [1] here.

Another [1] in middle.

[1] final tailnote target
```

Place cursor on the first `[1]` and test:

- `Ctrl+Shift+J` -> should jump to the last target line.
- `Ctrl+Shift+Alt+J` -> should open peek.
- Hover on `[1]` -> should show preview line.

## Troubleshooting

- `Ctrl+Shift+J` does nothing:
  - Check keybinding conflicts in `Keyboard Shortcuts`.
  - Run command manually from Command Palette: `Tailnote Jump: Jump To Tailnote`.
- `F12` says no definition:
  - Confirm file language mode is Markdown.
  - Confirm cursor is on `[num]` token.
  - Check that the file has at least one matching target for the same number.
- Extension installed but no effect:
  - Run `Developer: Reload Window`.
  - Verify extension is enabled in Extensions view.

## Development

```bash
npm install
npm run compile
```

Press `F5` in VS Code to launch Extension Development Host.
