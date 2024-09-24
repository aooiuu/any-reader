/**
 * 消息通信, 处理 webview 和 vscode
 */

import { Webview } from 'vscode';
import { IAdapter, IMessage } from 'easy-post-message';

export function createAdapter(webview: Webview): IAdapter {
  return () => {
    return {
      /**
       * 发送消息
       * @param target
       * @param data
       * @returns
       */
      postMessage: (target: any, data: any) => {
        target.postMessage(data);
      },

      /**
       * 添加事件监听器
       * @param {Function} callback 回调函数
       * @returns {Function} 销毁监听器
       */
      addMessageListener: (callback: (arg: { data: IMessage; source: any }) => void): (() => void) => {
        const handle = (arg: any) => {
          callback({
            data: arg,
            source: webview as unknown as Window // source.postMessage
          });
        };
        webview.onDidReceiveMessage(handle);
        return () => {};
      }
    };
  };
}
