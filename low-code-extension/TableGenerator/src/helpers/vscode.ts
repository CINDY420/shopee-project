import * as vscode from 'vscode';
import { EXTENSION_NAME } from '../constants'

export async function saveDataToSettingJson(section: string, data: any, configurationTarget = true): Promise<void> {
  await vscode.workspace.getConfiguration(EXTENSION_NAME).update(section, data, configurationTarget);
}

export function getDataFromSettingJson(section: string, defaultValue?: any): any {
  return vscode.workspace.getConfiguration(EXTENSION_NAME).get(section, defaultValue);
}