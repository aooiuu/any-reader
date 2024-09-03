import type { Rule } from '@any-reader/rule-utils';
import { AnalyzerFilter } from './analyzer/AnalyzerFilter';
import { AnalyzerHtml } from './analyzer/AnalyzerHtml';
import { AnalyzerJS } from './analyzer/AnalyzerJS';
import { AnalyzerJSONPath } from './analyzer/AnalyzerJSONPath';
import type { Analyzers } from './analyzer/AnalyzerManager';
import { AnalyzerManager } from './analyzer/AnalyzerManager';
import { AnalyzerRegExp } from './analyzer/AnalyzerRegExp';
import { AnalyzerReplace } from './analyzer/AnalyzerReplace';
import { AnalyzerXPath } from './analyzer/AnalyzerXPath';
import { AnalyzerWeb } from './analyzer/AnalyzerWeb';
import IPTV from './parser/iptv';
import { RuleManager } from './analyzer/RuleManager';

export * from './analyzer/RuleManager';
export * from './analyzer/AnalyzerManager';
export * from './exception';
export { analyzerUrl } from './analyzer/analyzerUrl';

export function createRuleManager(rule: Rule, analyzerManager?: AnalyzerManager) {
  // if (rule.loadJs && typeof rule.loadJs === 'string' && /^\/\/\s*@any-reader\/parser\/iptv\s*$/.test(rule.loadJs)) {
  if (rule.loadJs === '// @any-reader/parser/iptv') {
    return new IPTV(rule);
  }
  return new RuleManager(rule, analyzerManager || createAnalyzerManager());
}

export function createAnalyzerManager(analyzers?: Analyzers[]) {
  return new AnalyzerManager(
    analyzers || [
      {
        pattern: /^@css:/i,
        Analyzer: AnalyzerHtml
      },
      {
        pattern: /^@json:|^\$/i,
        replace: /^@json:/i,
        Analyzer: AnalyzerJSONPath
      },

      {
        pattern: /^@xpath:|^\//i,
        replace: /^@xpath:/i,
        Analyzer: AnalyzerXPath
      },
      {
        pattern: /^@regexp:|^@regex:|^:/i,
        Analyzer: AnalyzerRegExp
      },
      {
        pattern: /^@js:/i,
        Analyzer: AnalyzerJS
      },
      {
        pattern: /^@filter:/i,
        Analyzer: AnalyzerFilter
      },
      {
        pattern: /^@replace:/i,
        Analyzer: AnalyzerReplace
      },
      {
        pattern: /^@web:|@webview:/i,
        Analyzer: AnalyzerWeb
      }
    ]
  );
}
