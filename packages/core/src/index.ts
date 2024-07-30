import type { Rule } from '@any-reader/rule-utils'
import { AnalyzerFilter } from './analyzer/AnalyzerFilter'
import { AnalyzerHtml } from './analyzer/AnalyzerHtml'
import { AnalyzerJS } from './analyzer/AnalyzerJS'
import { AnalyzerJSONPath } from './analyzer/AnalyzerJSONPath'
import { AnalyzerManager } from './analyzer/AnalyzerManager'
import { AnalyzerRegExp } from './analyzer/AnalyzerRegExp'
import { AnalyzerReplace } from './analyzer/AnalyzerReplace'
import { AnalyzerXPath } from './analyzer/AnalyzerXPath'
import type { Analyzers } from './analyzer/AnalyzerManager'
import { RuleManager } from './analyzer/RuleManager'

export * from './analyzer/RuleManager'
export { fetch as analyzerUrl } from './analyzer/AnalyzerUrl'

export function createRuleManager(rule: Rule, analyzerManager?: AnalyzerManager) {
  return new RuleManager(rule, analyzerManager || createAnalyzerManager())
}

export function createAnalyzerManager(analyzers?: Analyzers[]) {
  return new AnalyzerManager(analyzers || [
    {
      pattern: /^@css:/i,
      Analyzer: AnalyzerHtml,
    },
    {
      pattern: /^@json:|^\$/i,
      replace: /^@json:/i,
      Analyzer: AnalyzerJSONPath,
    },

    {
      pattern: /^@xpath:|^\//i,
      replace: /^@xpath:/i,
      Analyzer: AnalyzerXPath,
    },
    {
      pattern: /^@regexp:|^@regex:|^:/i,
      Analyzer: AnalyzerRegExp,
    },
    {
      pattern: /^@js:/i,
      Analyzer: AnalyzerJS,
    },
    {
      pattern: /^@filter:/i,
      Analyzer: AnalyzerFilter,
    },
    {
      pattern: /^@replace:/i,
      Analyzer: AnalyzerReplace,
    },
  ])
}
