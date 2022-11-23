import { pathExists } from 'fs-extra';
import * as vscode from 'vscode';

/**
 * 打开目录
 */
export async function openDir(projectDir: string): Promise<void> {
  const isExists = await pathExists(projectDir);
  if (!isExists) {
    throw new Error('error');
  }
  vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(projectDir), true);
}

/**
 * 选择文件目录，返回所选目录路径
 */
export const selectFolder = async () => {
  const options: vscode.OpenDialogOptions = {
    canSelectFolders: true,
    canSelectFiles: false,
    canSelectMany: false
  };
  const selectFolderUri = await vscode.window.showOpenDialog(options);
  if (selectFolderUri) {
    const { fsPath } = selectFolderUri[0];
    return fsPath;
  }
};