import { fromByteArray, toByteArray } from 'base64-js';
import pako from 'pako';

const { deflate, inflate } = pako;

/**
 * 规则解码
 * @param {string} text
 * @returns
 */
export function decodeRule(text: string) {
  const lastIndex = text.lastIndexOf('@');
  const gzipBytes = toByteArray(text.substring(lastIndex + 1));
  return JSON.parse(inflate(gzipBytes, { to: 'string' }));
}

/**
 * 规则编码
 * @param text
 * @returns
 */
export function encodeRule(text: any): string {
  const rule = typeof text === 'string' ? JSON.parse(text) : text;
  const ruleText = typeof text === 'string' ? text : JSON.stringify(text);
  const tag = 'eso://';
  const encodeRuleText = fromByteArray(deflate(ruleText));
  return `${tag}${rule.author || ''}:${rule.name || ''}@${encodeRuleText}`;
}
