export class AnalyzerException extends Error {
  constructor(message = '', rule: string) {
    super(
      JSON.stringify({
        type: 'AnalyzerException',
        rule,
        message
      })
    );
  }
}
