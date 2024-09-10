import { AnalyzerFilter } from './analyzer/AnalyzerFilter';
import { AnalyzerHtml } from './analyzer/AnalyzerHtml';
import { AnalyzerJS } from './analyzer/AnalyzerJS';
import { AnalyzerJSONPath } from './analyzer/AnalyzerJSONPath';
import { AnalyzerManager, Analyzers } from './analyzer/AnalyzerManager';
import { AnalyzerRegExp } from './analyzer/AnalyzerRegExp';
import { AnalyzerReplace } from './analyzer/AnalyzerReplace';
import { AnalyzerXPath } from './analyzer/AnalyzerXPath';
import { AnalyzerWeb } from './analyzer/AnalyzerWeb';
import { ILogger, LogLevel, NoLogger } from './logger';

export { analyzerUrl } from './analyzer/analyzerUrl';

export function createAnalyzerManager(params: { analyzers?: Analyzers[]; logger?: ILogger; logLevel?: LogLevel } = {}): AnalyzerManager {
  return new AnalyzerManager({
    logger: params.logger || new NoLogger(),
    logLevel: params.logLevel || LogLevel.Off,
    analyzers: params.analyzers || [
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
  });
}
