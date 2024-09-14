import { AnalyzerHtml } from '../analyzer/AnalyzerHtml';
import { AnalyzerJS } from '../analyzer/AnalyzerJS';
import { AnalyzerJSONPath } from '../analyzer/AnalyzerJSONPath';
import { AnalyzerRegExp } from '../analyzer/AnalyzerRegExp';
import { AnalyzerReplace } from '../analyzer/AnalyzerReplace';
import { AnalyzerXPath } from '../analyzer/AnalyzerXPath';
import { AnalyzerManager, AnalyzerManagerOption } from '../analyzer/AnalyzerManager';
import { LogLevel, NoLogger } from '../logger';
import { JSEngine } from '../analyzer/JSEngine';

export { AnalyzerHtml, AnalyzerJS, AnalyzerJSONPath, AnalyzerRegExp, AnalyzerReplace, AnalyzerXPath };

export function createAnalyzerManager(params: Partial<AnalyzerManagerOption> = {}): AnalyzerManager {
  return new AnalyzerManager({
    logger: params.logger || new NoLogger(),
    logLevel: params.logLevel || LogLevel.Off,
    JSEngine: params.JSEngine || JSEngine,
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
      // {
      //   pattern: /^@filter:/i,
      //   Analyzer: AnalyzerFilter
      // },
      {
        pattern: /^@replace:/i,
        Analyzer: AnalyzerReplace
      }
      // {
      //   pattern: /^@web:|@webview:/i,
      //   Analyzer: AnalyzerWeb
      // }
    ]
  });
}
