import type { Rule } from '@any-reader/rule-utils'
import { AnalyzerFilter } from './analyzer/AnalyzerFilter'
import { AnalyzerHtml } from './analyzer/AnalyzerHtml'
import { AnalyzerJS } from './analyzer/AnalyzerJS'
import { AnalyzerJSONPath } from './analyzer/AnalyzerJSONPath'
import { AnalyzerManager } from './analyzer/AnalyzerManager'
import { AnalyzerRegExp } from './analyzer/AnalyzerRegExp'
import { AnalyzerReplace } from './analyzer/AnalyzerReplace'
import { AnalyzerXPath } from './analyzer/AnalyzerXPath'
import { RuleManager } from './analyzer/RuleManager'
import type { Analyzer } from './analyzer/Analyzer'

export * from './analyzer/RuleManager'
export { fetch as analyzerUrl } from './analyzer/AnalyzerUrl'

export function createRuleManager(rule: Rule, analyzerManager?: AnalyzerManager) {
  return new RuleManager(rule, analyzerManager || createAnalyzerManager())
}

export function createAnalyzerManager(analyzers?: typeof Analyzer[]) {
  return new AnalyzerManager(analyzers || [
    AnalyzerHtml,
    AnalyzerJSONPath,
    AnalyzerXPath,
    AnalyzerRegExp,
    AnalyzerJS,
    AnalyzerFilter,
    AnalyzerReplace,
  ])
}
