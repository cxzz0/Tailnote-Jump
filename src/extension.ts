import * as vscode from "vscode";

function getReferenceAtPosition(
  document: vscode.TextDocument,
  position: vscode.Position
): { num: string; range: vscode.Range } | null {
  const lineText = document.lineAt(position.line).text;
  const inlineRefRegex = /\[(\d+)\]/g;

  for (const match of lineText.matchAll(inlineRefRegex)) {
    const full = match[0];
    const num = match[1];
    const start = match.index ?? 0;
    const end = start + full.length;

    // Accept cursor at token end as well, so pressing F12 right after "]" still works.
    if (position.character >= start && position.character <= end) {
      return {
        num,
        range: new vscode.Range(
          new vscode.Position(position.line, start),
          new vscode.Position(position.line, end)
        )
      };
    }
  }

  return null;
}

function findLastTailnoteLine(
  document: vscode.TextDocument,
  num: string
): vscode.Range | null {
  // Tailnote line patterns:
  // [1] text
  //   [1] text
  // [1]:
  const tailnoteLineRegex = new RegExp(`^(\\s*)(\\[${num}\\])(?=\\s|$|:|：)`);
  let lastRange: vscode.Range | null = null;

  for (let line = 0; line < document.lineCount; line++) {
    const text = document.lineAt(line).text;
    const match = text.match(tailnoteLineRegex);
    if (!match) {
      continue;
    }

    const leadingSpaces = match[1]?.length ?? 0;
    const token = match[2];
    const start = new vscode.Position(line, leadingSpaces);
    const end = new vscode.Position(line, leadingSpaces + token.length);
    lastRange = new vscode.Range(start, end);
  }

  return lastRange;
}

function findLastAnyReference(
  document: vscode.TextDocument,
  num: string
): vscode.Range | null {
  const regex = new RegExp(`\\[${num}\\]`, "g");
  const text = document.getText();

  let lastMatch: RegExpExecArray | null = null;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    lastMatch = match;
  }

  if (!lastMatch || lastMatch.index === undefined) {
    return null;
  }

  const start = document.positionAt(lastMatch.index);
  const end = document.positionAt(lastMatch.index + lastMatch[0].length);
  return new vscode.Range(start, end);
}

function resolveTargetLocation(
  document: vscode.TextDocument,
  position: vscode.Position
): vscode.Location | null {
  const ref = getReferenceAtPosition(document, position);
  if (!ref) {
    return null;
  }

  const target =
    findLastTailnoteLine(document, ref.num) ??
    findLastAnyReference(document, ref.num);
  if (!target) {
    return null;
  }

  if (target.isEqual(ref.range)) {
    return null;
  }

  return new vscode.Location(document.uri, target);
}

export function activate(context: vscode.ExtensionContext): void {
  const selector: vscode.DocumentSelector = { language: "markdown" };

  const provider: vscode.DefinitionProvider = {
    provideDefinition(document, position) {
      return resolveTargetLocation(document, position);
    }
  };

  const hoverProvider: vscode.HoverProvider = {
    provideHover(document, position) {
      const ref = getReferenceAtPosition(document, position);
      if (!ref) {
        return null;
      }

      const location = resolveTargetLocation(document, position);
      if (!location) {
        return null;
      }

      const lineText = document.lineAt(location.range.start.line).text.trim();
      const md = new vscode.MarkdownString();
      md.appendMarkdown(`**Tailnote [${ref.num}]**  \n`);
      md.appendCodeblock(lineText || `[${ref.num}]`, "markdown");
      md.appendMarkdown(`\nLine ${location.range.start.line + 1}`);
      return new vscode.Hover(md, ref.range);
    }
  };

  const jumpCommand = vscode.commands.registerCommand(
    "tailnoteJump.jumpToTailnote",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const location = resolveTargetLocation(
        editor.document,
        editor.selection.active
      );
      if (!location) {
        vscode.window.showInformationMessage(
          "Tailnote Jump: 当前光标位置没有可跳转的尾注。"
        );
        return;
      }

      editor.selection = new vscode.Selection(
        location.range.start,
        location.range.end
      );
      editor.revealRange(location.range, vscode.TextEditorRevealType.InCenter);
    }
  );

  const peekCommand = vscode.commands.registerCommand(
    "tailnoteJump.peekTailnote",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const location = resolveTargetLocation(
        editor.document,
        editor.selection.active
      );
      if (!location) {
        vscode.window.showInformationMessage(
          "Tailnote Jump: 当前光标位置没有可预览的尾注。"
        );
        return;
      }

      await vscode.commands.executeCommand(
        "editor.action.peekLocations",
        editor.document.uri,
        editor.selection.active,
        [location],
        "peek"
      );
    }
  );

  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(selector, provider),
    vscode.languages.registerHoverProvider(selector, hoverProvider),
    jumpCommand,
    peekCommand
  );
}

export function deactivate(): void {}
