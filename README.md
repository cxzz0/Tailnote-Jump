# Tailnote Jump

在 Markdown 中，光标落在 `[num]` 时，跳到同文件中该编号的目标位置。

## 规则

1. 先找尾注行：`^\s*\[num\](\s|$|:|：)`，取最后一个。
2. 如果没找到尾注行，退回到最后一个 `[num]`。
3. 如果当前就在目标上，不跳转。

## 打包 VSIX（创建安装包）

在项目根目录执行：

```powershell
npm install
npm run compile
node D:\nodejs\node_modules\npm\bin\npm-cli.js exec --cache .npm-cache --package @vscode/vsce -- vsce package
```

产物：

- `tailnote-jump-0.0.1.vsix`

## 安装到 VS Code

### 方式 A：VS Code 界面

1. 打开扩展面板（`Ctrl+Shift+X`）。
2. 右上角 `...` -> `Install from VSIX...`。
3. 选择 `tailnote-jump-0.0.1.vsix`。
4. 执行 `Developer: Reload Window`。

### 方式 B：命令行

```powershell
code --install-extension "F:\tests\plugin\tailnote-jump-0.0.1.vsix" --force
```

## 自定义全局扩展目录（可选）

```powershell
code --extensions-dir "D:\VSCodeExtensions" --install-extension "F:\tests\plugin\tailnote-jump-0.0.1.vsix" --force
```

之后启动 VS Code 也要带同一个目录：

```powershell
code --extensions-dir "D:\VSCodeExtensions"
```

## 用法

- `F12`：跳转（本插件的 DefinitionProvider）
- `Alt+F12`：Peek Definition
- `Ctrl+Shift+J` / `Cmd+Shift+J`：Jump 命令
- `Ctrl+Shift+Alt+J` / `Cmd+Shift+Alt+J`：Peek 命令
- Hover 到 `[num]`：预览目标尾注行

## 最短排错

- 快捷键没反应：检查 Keyboard Shortcuts 是否冲突，或在命令面板执行 `Tailnote Jump: Jump To Tailnote`。
- 仍提示无定义：确认文件语言是 Markdown，光标在 `[num]` 上，且文件中存在同编号目标。
