export abstract class Analyzer {
  abstract parse(content: string): void
  abstract getString(rule: string): Promise<string>
  abstract getStringList(rule: string): Promise<string[]>
  abstract getElements(rule: string): Promise<string | string []>
}
