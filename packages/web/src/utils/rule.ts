import type { Rule } from '@any-reader/rule-utils';

export const isRule = (rule: Rule | string) => {
  if (typeof rule === 'string') {
    return rule.startsWith('eso://');
  }

  if (typeof rule !== 'object') return false;

  return rule.id && rule.host && typeof rule.contentType !== 'undefined';
};
