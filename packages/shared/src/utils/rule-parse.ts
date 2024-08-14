import { createRuleManager as _createRuleManager, analyzerUrl, createAnalyzerManager } from '@any-reader/core';
import type { Rule } from '@any-reader/rule-utils';

export function createRuleManager(rule: Rule) {
  return _createRuleManager(rule, createAnalyzerManager());
}

export { analyzerUrl, createAnalyzerManager };
