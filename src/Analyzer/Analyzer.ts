export abstract class Analyzer {
  abstract parse(content: string): void
  abstract getString(rule: string): Promise<string[]>
  abstract getStringList(rule: string): void
  abstract getElements(rule: string): string | string []
}
