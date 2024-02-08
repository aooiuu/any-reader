const isDev = import.meta.env.MODE === 'development';

declare let acquireVsCodeApi: any;

if (!isDev && !window.vscode) {
  window.vscode = acquireVsCodeApi();
}

export function postMessage(type: string, data: any) {
  if (isDev) {
    window.parent?.postMessage(
      {
        type: 'sendToVSCode',
        data: {
          type,
          data
        }
      },
      '*'
    );
  } else {
    window.vscode.postMessage({
      type,
      data
    });
  }
}

export function useMessage(type: string, cb: any) {
  function onMessage({ data: _data }: any) {
    let params = _data;
    if (!isDev) {
      params = _data.data;
    }

    const { type: _type, data } = params;
    if (type === _type) {
      cb(data);
    }
  }

  window.addEventListener('message', onMessage);

  onUnmounted(() => {
    window.removeEventListener('message', onMessage);
  });
}
