export type ReaderAnnotationKind = 'highlight' | 'text' | 'ink';

export type ReaderAnnotationColor = 'yellow' | 'green' | 'blue' | 'pink' | 'purple';

export interface TextQuoteSelector {
  type: 'TextQuoteSelector';
  exact: string;
  prefix: string;
  suffix: string;
}

export interface TextPositionSelector {
  type: 'TextPositionSelector';
  start: number;
  end: number;
}

export interface CssSelector {
  type: 'CssSelector';
  value: string;
  refinedBy: TextPositionSelector;
}

export interface AnyReaderDomRangeSelector {
  type: 'AnyReaderDomRangeSelector';
  startPath: number[];
  startOffset: number;
  endPath: number[];
  endOffset: number;
}

export interface ProgressionSelector {
  type: 'ProgressionSelector';
  value: number;
}

export type ReaderAnnotationSelector = TextQuoteSelector | CssSelector | AnyReaderDomRangeSelector | ProgressionSelector;

export interface ReaderAnnotationTarget {
  source: string;
  type: 'application/xhtml+xml';
  filePath: string;
  chapterPath: string;
  chapterHref?: string;
  chapterTitle?: string;
  selectors: ReaderAnnotationSelector[];
  orphaned?: boolean;
}

export interface ReaderAnnotationLLM {
  sourceFile: string;
  citation: string;
  chapterTitle?: string;
  quote: string;
  before: string;
  after: string;
  note: string;
}

export interface ReaderAnnotation {
  id: string;
  kind: ReaderAnnotationKind;
  color: ReaderAnnotationColor;
  note: string;
  createdAt: string;
  updatedAt: string;
  target: ReaderAnnotationTarget;
  llm: ReaderAnnotationLLM;
}

export interface AnnotationFile {
  schemaVersion: 1;
  sourceFile: string;
  sourceName: string;
  updatedAt: string;
  annotations: ReaderAnnotation[];
}

export interface AnnotationListParams {
  filePath: string;
  chapterPath?: string;
}

export interface AnnotationUpsertParams {
  filePath: string;
  annotation: ReaderAnnotation;
}

export interface AnnotationRemoveParams {
  filePath: string;
  id: string;
}
