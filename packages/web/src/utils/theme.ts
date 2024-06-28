import type { GlobalToken } from 'ant-design-vue/es/theme';
import { kebabCase } from 'lodash';
import { updateCSS } from '@v-c/utils';

function formatKey(key: string, prefixCls: string) {
  return `${prefixCls}${kebabCase(key)}`;
}
const prefixCls = '--ar-';

const dynamicStyleMark = `${prefixCls}${Date.now()}-${Math.random()}`;

export function registerTokenToCSSVar(token: GlobalToken) {
  const variables: Record<string, any> = {};
  if (!token) return;

  for (const key in token) {
    const val = token[key as keyof GlobalToken];
    variables[formatKey(key, prefixCls)] = val;
  }
  const cssList = Object.keys(variables).map((key) => `${key}: ${variables[key]};`);
  updateCSS(`:root {${cssList.join('\n')}}`, `${dynamicStyleMark}-dynamic-theme`);
}
