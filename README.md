# Tailnote Jump

Jump from an inline markdown reference like `[12]` to the last matching tailnote line in the same file.

## Rule

When the cursor is on `[num]`:

1. Search current markdown file for tailnote-like lines that start with `[num]`, optionally after spaces, and are followed by whitespace, end-of-line, `:`, or `：`.
2. Use the last matched line as the target.
3. If no tailnote-like line exists, fallback to the last `[num]` in this file.
4. If cursor is already on that target, do not jump.

## Usage

In a markdown file:

- `F12` for Go to Definition (provided by this extension's DefinitionProvider)
- `Alt+F12` for built-in Peek Definition
- `Ctrl/Cmd + Click` for definition jump
- `Ctrl+Shift+J` (`Cmd+Shift+J` on macOS) for explicit jump command
- `Ctrl+Shift+Alt+J` (`Cmd+Shift+Alt+J` on macOS) for explicit peek command
- Hover on `[num]` to preview target tailnote line

## Development

```bash
npm install
npm run compile
```

Then press `F5` in VS Code to launch Extension Development Host.
