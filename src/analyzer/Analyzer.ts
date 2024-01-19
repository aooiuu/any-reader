export abstract class Analyzer {
  abstract parse(content: string): void
  abstract getString(rule: string): string
  abstract getStringList(rule: string): string[]
  abstract getElements(rule: string): string | string []
}
