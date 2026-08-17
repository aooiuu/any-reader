import { describe, expect, it } from 'vitest';
import type { ReaderAnnotation } from '../../../shared/src/utils/annotations/types';
import {
  createAnnotationFromSelection,
  rangeOverlapsAnnotation,
  renderAnnotations,
  restoreAnnotationRange
} from '../../src/pages/vscode/content/annotations';

function mountContent(html = '<div class="center-row" data-idx="0">Hello brave new world.</div>') {
  document.body.innerHTML = `<div id="text-container">${html}</div>`;
  return document.querySelector('#text-container') as HTMLElement;
}

function selectText(textNode: Text, start: number, end: number) {
  const range = document.createRange();
  range.setStart(textNode, start);
  range.setEnd(textNode, end);
  const selection = window.getSelection()!;
  selection.removeAllRanges();
  selection.addRange(range);
  return selection;
}

function createMountedAnnotation() {
  const root = mountContent();
  const textNode = root.querySelector('.center-row')!.firstChild as Text;
  const selection = selectText(textNode, 6, 11);
  const annotation = createAnnotationFromSelection({
    root,
    selection,
    filePath: '/books/demo.epub',
    chapterPath: 'chapter-1',
    chapterHref: 'OEBPS/chapter-1.xhtml',
    chapterTitle: 'Chapter 1',
    color: 'yellow',
    note: 'memo'
  })!;

  return { root, annotation };
}

describe('VSCode EPUB annotations DOM helpers', () => {
  it('creates an LLM-friendly annotation from a DOM selection', () => {
    const { annotation } = createMountedAnnotation();

    expect(annotation.llm).toMatchObject({
      sourceFile: '/books/demo.epub',
      chapterTitle: 'Chapter 1',
      quote: 'brave',
      note: 'memo'
    });
    expect(annotation.target.selectors.map((selector) => selector.type)).toEqual([
      'TextQuoteSelector',
      'CssSelector',
      'AnyReaderDomRangeSelector',
      'ProgressionSelector'
    ]);
  });

  it('restores and renders the highlight after the HTML is reloaded', () => {
    const { annotation } = createMountedAnnotation();
    const root = mountContent();

    const orphaned = renderAnnotations({
      root,
      annotations: [annotation],
      onClick: () => {}
    });

    expect(orphaned).toEqual([]);
    expect(root.querySelector('.ar-annotation')?.textContent).toBe('brave');
  });

  it('falls back to TextQuoteSelector when structural selectors fail', () => {
    const { annotation } = createMountedAnnotation();
    const fallbackAnnotation: ReaderAnnotation = {
      ...annotation,
      target: {
        ...annotation.target,
        selectors: annotation.target.selectors.map((selector) => {
          if (selector.type === 'AnyReaderDomRangeSelector') {
            return { ...selector, startPath: [99], endPath: [99] };
          }
          if (selector.type === 'CssSelector') {
            return { ...selector, value: '.missing-row', refinedBy: { ...selector.refinedBy, start: 999, end: 1004 } };
          }
          return selector;
        })
      }
    };
    const root = mountContent('<div class="center-row" data-idx="0">Hello brave new world!</div>');

    expect(restoreAnnotationRange(root, fallbackAnnotation)?.toString()).toBe('brave');
  });

  it('detects overlapping selections', () => {
    const { annotation } = createMountedAnnotation();
    const root = mountContent();
    renderAnnotations({
      root,
      annotations: [annotation],
      onClick: () => {}
    });

    const markText = root.querySelector('.ar-annotation')!.firstChild as Text;
    const range = selectText(markText, 1, 3).getRangeAt(0);

    expect(rangeOverlapsAnnotation(root, range)).toBe(true);
  });

  it('emits hover callbacks from rendered highlights', () => {
    const { annotation } = createMountedAnnotation();
    const root = mountContent();
    const events: string[] = [];
    renderAnnotations({
      root,
      annotations: [annotation],
      onClick: () => {},
      onHoverStart: (item) => events.push(`start:${item.id}`),
      onHoverMove: (item) => events.push(`move:${item.id}`),
      onHoverEnd: (item) => events.push(`end:${item.id}`)
    });

    const mark = root.querySelector('.ar-annotation')!;
    mark.dispatchEvent(new MouseEvent('mouseenter', { bubbles: false }));
    mark.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
    mark.dispatchEvent(new MouseEvent('mouseleave', { bubbles: false }));

    expect(events).toEqual([`start:${annotation.id}`, `move:${annotation.id}`, `end:${annotation.id}`]);
  });
});
