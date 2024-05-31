export const isRule = (rule: any) => {
  if (typeof rule === 'string') {
    return rule.startsWith('eso://:');
  }

  if (typeof rule !== 'object') return false;

  return rule.id && rule.host && rule.contentType;
};
