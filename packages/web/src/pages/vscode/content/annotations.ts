import { v4 as uuidV4 } from 'uuid';
import type {
  AnyReaderDomRangeSelector,
  CssSelector,
  ProgressionSelector,
  ReaderAnnotation,
  ReaderAnnotationColor,
  ReaderAnnotationSelector,
  TextQuoteSelector
} from '../../../../../shared/src/utils/annotations/types';

const ANNOTATION_CLASS = 'ar-annotation';
const CONTEXT_LENGTH = 60;

interface SelectionAnnotationOptions {
  root: HTMLElement;
  selection: Selection;
  filePath: string;
  chapterPath: string;
  chapterHref?: string;
  chapterTitle?: string;
  color: ReaderAnnotationColor;
  note: string;
}

interface RenderAnnotationOptions {
  root: HTMLElement;
  annotations: ReaderAnnotation[];
  onClick: (annotation: ReaderAnnotation, event: MouseEvent) => void;
  onHoverStart?: (annotation: ReaderAnnotation, event: MouseEvent) => void;
  onHoverMove?: (annotation: ReaderAnnotation, event: MouseEvent) => void;
  onHoverEnd?: (annotation: ReaderAnnotation, event: MouseEvent) => void;
}

interface TextPosition {
  start: number;
  end: number;
}

function getTextNodes(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) return [root as Text];

  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    textNodes.push(node as Text);
    node = walker.nextNode();
  }
  return textNodes;
}

function getNodePath(root: Node, node: Node) {
  const path: number[] = [];
  let current: Node | null = node;
  while (current && current !== root) {
    const parent = current.parentNode;
    if (!parent) return [];
    path.unshift(Array.from(parent.childNodes).indexOf(current));
    current = parent;
  }
  return current === root ? path : [];
}

function getNodeByPath(root: Node, nodePath: number[]) {
  let current: Node | null = root;
  for (const index of nodePath) {
    current = current?.childNodes[index] || null;
    if (!current) return null;
  }
  return current;
}

function getTextPosition(root: Node, range: Range): TextPosition | null {
  let cursor = 0;
  let start: number | undefined;
  let end: number | undefined;

  for (const textNode of getTextNodes(root)) {
    const length = textNode.data.length;
    if (textNode === range.startContainer) start = cursor + range.startOffset;
    if (textNode === range.endContainer) end = cursor + range.endOffset;
    cursor += length;
  }

  if (typeof start === 'undefined' || typeof end === 'undefined' || start > end) return null;
  return { start, end };
}

function rangeFromTextPosition(root: Node, start: number, end: number) {
  const range = document.createRange();
  let cursor = 0;
  let started = false;

  for (const textNode of getTextNodes(root)) {
    const nextCursor = cursor + textNode.data.length;
    if (!started && start <= nextCursor) {
      range.setStart(textNode, Math.max(0, start - cursor));
      started = true;
    }
    if (started && end <= nextCursor) {
      range.setEnd(textNode, Math.max(0, end - cursor));
      return range;
    }
    cursor = nextCursor;
  }

  return null;
}

function getClosestContentRow(node: Node | null) {
  const element = node instanceof Element ? node : node?.parentElement;
  return element?.closest('.center-row') as HTMLElement | null;
}

function getCssTarget(root: HTMLElement, range: Range) {
  const startRow = getClosestContentRow(range.startContainer);
  const endRow = getClosestContentRow(range.endContainer);
  if (startRow && startRow === endRow) return startRow;
  return root;
}

function getCssSelector(root: HTMLElement, target: HTMLElement) {
  if (target === root) return '#text-container';
  const rowIndex = target.dataset.idx;
  return typeof rowIndex !== 'undefined' ? `[data-idx="${rowIndex}"]` : '#text-container';
}

function getSelector<T extends ReaderAnnotationSelector>(selectors: ReaderAnnotationSelector[], type: T['type']): T | undefined {
  return selectors.find((selector) => selector.type === type) as T | undefined;
}

function getQuoteRange(root: HTMLElement, quoteSelector: TextQuoteSelector) {
  const text = root.textContent || '';
  const matches: number[] = [];
  let cursor = text.indexOf(quoteSelector.exact);
  while (cursor >= 0) {
    matches.push(cursor);
    cursor = text.indexOf(quoteSelector.exact, cursor + quoteSelector.exact.length);
  }

  const index =
    matches.find((match) => {
      const prefix = text.slice(Math.max(0, match - quoteSelector.prefix.length), match);
      const suffix = text.slice(match + quoteSelector.exact.length, match + quoteSelector.exact.length + quoteSelector.suffix.length);
      return prefix === quoteSelector.prefix && suffix === quoteSelector.suffix;
    }) ?? matches[0];

  if (typeof index === 'undefined') return null;
  return rangeFromTextPosition(root, index, index + quoteSelector.exact.length);
}

function restoreDomRange(root: HTMLElement, selector: AnyReaderDomRangeSelector) {
  const startNode = getNodeByPath(root, selector.startPath);
  const endNode = getNodeByPath(root, selector.endPath);
  if (!startNode || !endNode) return null;

  try {
    const range = document.createRange();
    range.setStart(startNode, selector.startOffset);
    range.setEnd(endNode, selector.endOffset);
    return range;
  } catch {
    return null;
  }
}

function restoreTextPositionRange(root: HTMLElement, selector: CssSelector) {
  const scope = root.querySelector(selector.value) || root;
  return rangeFromTextPosition(scope, selector.refinedBy.start, selector.refinedBy.end);
}

function wrapRange(annotation: ReaderAnnotation, range: Range, options: RenderAnnotationOptions) {
  const textNodes = getTextNodes(range.commonAncestorContainer)
    .filter((node) => {
      try {
        return range.intersectsNode(node);
      } catch {
        return false;
      }
    })
    .reverse();

  for (const textNode of textNodes) {
    const startOffset = textNode === range.startContainer ? range.startOffset : 0;
    const endOffset = textNode === range.endContainer ? range.endOffset : textNode.data.length;
    if (startOffset >= endOffset) continue;

    const nodeRange = document.createRange();
    nodeRange.setStart(textNode, startOffset);
    nodeRange.setEnd(textNode, endOffset);

    const mark = document.createElement('span');
    mark.className = `${ANNOTATION_CLASS} ${ANNOTATION_CLASS}--${annotation.color}`;
    mark.dataset.annotationId = annotation.id;
    mark.setAttribute('aria-label', annotation.note || annotation.llm.quote);
    mark.addEventListener('click', (event) => {
      event.stopPropagation();
      options.onClick(annotation, event);
    });
    mark.addEventListener('mouseenter', (event) => {
      options.onHoverStart?.(annotation, event);
    });
    mark.addEventListener('mousemove', (event) => {
      options.onHoverMove?.(annotation, event);
    });
    mark.addEventListener('mouseleave', (event) => {
      options.onHoverEnd?.(annotation, event);
    });
    nodeRange.surroundContents(mark);
  }
}

/**
 * 判断当前页面是否应该启用 EPUB annotations。
 */
export function isEpubAnnotationEnabled(filePath?: string, ruleId?: string) {
  return !!filePath && !ruleId && /\.epub$/i.test(filePath);
}

/**
 * 从当前 DOM selection 生成一个可持久化、对 LLM 友好的 annotation。
 */
export function createAnnotationFromSelection(options: SelectionAnnotationOptions): ReaderAnnotation | null {
  const range = options.selection.rangeCount ? options.selection.getRangeAt(0).cloneRange() : null;
  if (!range || range.collapsed || !options.root.contains(range.commonAncestorContainer)) return null;

  const quote = options.selection.toString();
  if (!quote.trim()) return null;

  const rootPosition = getTextPosition(options.root, range);
  if (!rootPosition) return null;

  const cssTarget = getCssTarget(options.root, range);
  const cssPosition = getTextPosition(cssTarget, range);
  if (!cssPosition) return null;

  const rootText = options.root.textContent || '';
  const prefix = rootText.slice(Math.max(0, rootPosition.start - CONTEXT_LENGTH), rootPosition.start);
  const suffix = rootText.slice(rootPosition.end, rootPosition.end + CONTEXT_LENGTH);
  const source = options.chapterHref || options.chapterPath;
  const now = new Date().toISOString();
  const selectors: ReaderAnnotationSelector[] = [
    {
      type: 'TextQuoteSelector',
      exact: quote,
      prefix,
      suffix
    },
    {
      type: 'CssSelector',
      value: getCssSelector(options.root, cssTarget),
      refinedBy: {
        type: 'TextPositionSelector',
        start: cssPosition.start,
        end: cssPosition.end
      }
    },
    {
      type: 'AnyReaderDomRangeSelector',
      startPath: getNodePath(options.root, range.startContainer),
      startOffset: range.startOffset,
      endPath: getNodePath(options.root, range.endContainer),
      endOffset: range.endOffset
    },
    {
      type: 'ProgressionSelector',
      value: rootText.length ? rootPosition.start / rootText.length : 0
    } satisfies ProgressionSelector
  ];

  return {
    id: uuidV4(),
    kind: 'highlight',
    color: options.color,
    note: options.note,
    createdAt: now,
    updatedAt: now,
    target: {
      source,
      type: 'application/xhtml+xml',
      filePath: options.filePath,
      chapterPath: options.chapterPath,
      chapterHref: options.chapterHref,
      chapterTitle: options.chapterTitle,
      selectors
    },
    llm: {
      sourceFile: options.filePath,
      citation: `${options.chapterTitle || options.chapterPath}: ${quote}`,
      chapterTitle: options.chapterTitle,
      quote,
      before: prefix,
      after: suffix,
      note: options.note
    }
  };
}

/**
 * 判断当前 selection 是否和已有高亮重叠。
 */
export function rangeOverlapsAnnotation(root: HTMLElement, range: Range) {
  return Array.from(root.querySelectorAll(`.${ANNOTATION_CLASS}`)).some((element) => {
    try {
      return range.intersectsNode(element);
    } catch {
      return false;
    }
  });
}

/**
 * 移除当前页面中渲染出来的 annotation wrapper，恢复原始文本节点结构。
 */
export function clearRenderedAnnotations(root: HTMLElement) {
  for (const mark of Array.from(root.querySelectorAll(`.${ANNOTATION_CLASS}`))) {
    const parent = mark.parentNode;
    if (!parent) continue;
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
    parent.removeChild(mark);
    parent.normalize();
  }
}

/**
 * 按 DomRange -> TextPosition -> TextQuote 的顺序恢复 annotation range。
 */
export function restoreAnnotationRange(root: HTMLElement, annotation: ReaderAnnotation) {
  const selectors = annotation.target.selectors;
  const domSelector = getSelector<AnyReaderDomRangeSelector>(selectors, 'AnyReaderDomRangeSelector');
  const cssSelector = getSelector<CssSelector>(selectors, 'CssSelector');
  const quoteSelector = getSelector<TextQuoteSelector>(selectors, 'TextQuoteSelector');

  return (
    (domSelector && restoreDomRange(root, domSelector)) ||
    (cssSelector && restoreTextPositionRange(root, cssSelector)) ||
    (quoteSelector && getQuoteRange(root, quoteSelector)) ||
    null
  );
}

/**
 * 在阅读页渲染 annotations，返回无法恢复位置的 annotation ids。
 */
export function renderAnnotations(options: RenderAnnotationOptions) {
  const orphanedIds: string[] = [];
  clearRenderedAnnotations(options.root);

  for (const annotation of options.annotations) {
    const range = restoreAnnotationRange(options.root, annotation);
    if (!range) {
      orphanedIds.push(annotation.id);
      continue;
    }
    wrapRange(annotation, range, options);
  }

  return orphanedIds;
}
