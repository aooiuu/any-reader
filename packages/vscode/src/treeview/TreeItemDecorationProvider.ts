/**
 * [侧边栏 - 规则] 右侧规则类型显示
 */

import { FileDecoration, FileDecorationProvider, ProviderResult, Uri } from 'vscode';
import { CONTENT_TYPE_TEXT } from '@any-reader/core';

export class TreeItemDecorationProvider implements FileDecorationProvider {
  public provideFileDecoration(uri: Uri): ProviderResult<FileDecoration> {
    if (uri.scheme !== 'any-reader' && uri.authority !== 'any-reader') {
      return;
    }

    const params: URLSearchParams = new URLSearchParams(uri.query);
    const contentType: number = +(params.get('contentType') || -1);

    return {
      badge: CONTENT_TYPE_TEXT[contentType]
    };
  }
}

export const treeItemDecorationProvider: TreeItemDecorationProvider = new TreeItemDecorationProvider();
