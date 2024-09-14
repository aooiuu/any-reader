import type { Rule } from '@any-reader/rule-utils';

import { AnalyzerManager } from '../analyzer/AnalyzerManager';
import IPTV from '../parser/iptv';
import { RuleManager } from '../analyzer/RuleManager';
import { createAnalyzerManager } from './analyzer';

export * from './analyzer';

export function createRuleManager(rule: Rule, analyzerManager?: AnalyzerManager) {
  // if (rule.loadJs && typeof rule.loadJs === 'string' && /^\/\/\s*@any-reader\/parser\/iptv\s*$/.test(rule.loadJs)) {
  if (rule.loadJs === '// @any-reader/parser/iptv') {
    return new IPTV(rule);
  }
  return new RuleManager(rule, analyzerManager || createAnalyzerManager({}));
}
