const isDev = import.meta.env.MODE === 'development';

declare let acquireVsCodeApi: any;

if (!isDev && !window.vscode) {
  window.vscode = acquireVsCodeApi();
}

export function postMessage(type: string, data: any) {
  window.vscode.postMessage({
    type,
    data
  });
}

export function useMessage(type: string, cb: any) {
  function onMessage({ data }: any) {
    const { type: _type, data: _data } = data;
    if (type === _type) {
      cb(_data);
    }
  }

  window.addEventListener('message', onMessage);

  onUnmounted(() => {
    window.removeEventListener('message', onMessage);
  });
}
