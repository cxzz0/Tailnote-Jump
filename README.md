# Tailnote Jump

Jump from an inline markdown reference like `[12]` to the last matching tailnote line in the same file.

## Rule

When the cursor is on `[num]`:

1. Search current markdown file for tailnote-like lines that start with `[num]`, optionally after spaces, and are followed by whitespace, end-of-line, `:`, or `：`.
2. Use the last matched line as the definition target.
3. If cursor is already on that last target, do not jump.

## Usage

In a markdown file:

- `F12` for Go to Definition
- `Alt+F12` for Peek Definition
- `Ctrl/Cmd + Click` for definition jump
- `Ctrl+Alt+J` (`Cmd+Alt+J` on macOS) for explicit command jump

## Development

```bash
npm install
npm run compile
```

Then press `F5` in VS Code to launch Extension Development Host.

