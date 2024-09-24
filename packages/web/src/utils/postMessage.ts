import EasyPostMessage, { type IAdapter, type IMessage } from 'easy-post-message';

if (typeof window.acquireVsCodeApi !== 'function') {
  window.acquireVsCodeApi = () => {};
}

if (typeof window.acquireVsCodeApi === 'function' && !window._acquireVsCodeApi) {
  window._acquireVsCodeApi = window.acquireVsCodeApi();
  window.acquireVsCodeApi = () => window._acquireVsCodeApi;
}

const VSCAdapter: IAdapter = () => {
  return {
    /**
     * 发送消息
     * @param target
     * @param data
     * @returns
     */
    postMessage: (_target, data) => {
      window.acquireVsCodeApi().postMessage(JSON.parse(JSON.stringify(data)));
    },

    /**
     * 添加事件监听器
     * @param {Function} callback 回调函数
     * @returns {Function} 销毁监听器
     */
    addMessageListener: (callback: (arg: { data: IMessage; source: any }) => void): (() => void) => {
      const cb = (arg: any) => {
        callback({
          data: arg.data,
          source: window.acquireVsCodeApi() as Window
        });
      };
      window.addEventListener('message', cb);

      return () => {
        window.removeEventListener('message', cb);
      };
    }
  };
};

export const pm = new EasyPostMessage(VSCAdapter);

export function useMessage(type: string, cb: any) {
  const fn = (arg: any) => {
    cb(arg?.data);
  };
  pm.on(type, fn);
  onUnmounted(() => {
    pm.off(type, fn);
  });
}
