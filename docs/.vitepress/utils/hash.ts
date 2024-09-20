// 编码
const utoa = (data: string) => {
  return btoa(unescape(encodeURIComponent(data)));
};

// 解码
const atou = (b64: string) => {
  return decodeURIComponent(escape(atob(b64)));
};

// 编码
export function encodeHash(data: Record<string, any>): string {
  if (typeof data !== 'object') return '';
  return utoa(JSON.stringify(data));
}

// 解码
export function decodeHash(): Record<string, any> {
  const hash = location.hash.slice(1);
  if (!hash) return {};
  return JSON.parse(atou(hash));
}
