import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { ReaderAnnotation } from '../../src/utils/annotations';
import { getAnnotationSidecarPath, listAnnotations, readAnnotationFile, removeAnnotation, upsertAnnotation } from '../../src/utils/annotations';

let tempDir = '';

function createAnnotation(id: string, filePath: string, chapterPath = 'chapter-1'): ReaderAnnotation {
  return {
    id,
    kind: 'highlight',
    color: 'yellow',
    note: 'note',
    createdAt: '',
    updatedAt: '',
    target: {
      source: 'OEBPS/chapter-1.xhtml',
      type: 'application/xhtml+xml',
      filePath,
      chapterPath,
      chapterHref: 'OEBPS/chapter-1.xhtml',
      chapterTitle: 'Chapter 1',
      selectors: [
        {
          type: 'TextQuoteSelector',
          exact: 'selected text',
          prefix: 'before ',
          suffix: ' after'
        },
        {
          type: 'CssSelector',
          value: '[data-idx="0"]',
          refinedBy: {
            type: 'TextPositionSelector',
            start: 1,
            end: 14
          }
        },
        {
          type: 'AnyReaderDomRangeSelector',
          startPath: [0],
          startOffset: 1,
          endPath: [0],
          endOffset: 14
        },
        {
          type: 'ProgressionSelector',
          value: 0.25
        }
      ]
    },
    llm: {
      sourceFile: filePath,
      citation: 'Chapter 1: selected text',
      chapterTitle: 'Chapter 1',
      quote: 'selected text',
      before: 'before ',
      after: ' after',
      note: 'note'
    }
  };
}

beforeEach(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'any-reader-annotations-'));
});

afterEach(async () => {
  await fs.rm(tempDir, { recursive: true, force: true });
});

describe('annotation sidecar store', () => {
  it('uses the EPUB sidecar naming convention', () => {
    expect(getAnnotationSidecarPath('/books/My Book.epub')).toBe('/books/My Book.epub.any-reader.annotations.json');
    expect(getAnnotationSidecarPath('C:\\Books\\中文 Book.epub')).toBe('C:\\Books\\中文 Book.epub.any-reader.annotations.json');
  });

  it('returns an empty annotation file when the sidecar does not exist', async () => {
    const filePath = path.join(tempDir, 'empty book.epub');
    const data = await readAnnotationFile(filePath);

    expect(data.sourceFile).toBe(filePath);
    expect(data.sourceName).toBe('empty book.epub');
    expect(data.annotations).toEqual([]);
  });

  it('upserts, filters, and removes annotations', async () => {
    const filePath = path.join(tempDir, '测试 book.epub');
    const first = await upsertAnnotation({ filePath, annotation: createAnnotation('a1', filePath) });
    await upsertAnnotation({ filePath, annotation: createAnnotation('a2', filePath, 'chapter-2') });
    const updated = await upsertAnnotation({
      filePath,
      annotation: {
        ...first,
        note: 'updated note',
        llm: {
          ...first.llm,
          note: 'updated note'
        }
      }
    });

    expect(updated.createdAt).toBe(first.createdAt);
    expect(updated.updatedAt >= first.updatedAt).toBe(true);
    expect(await listAnnotations({ filePath })).toHaveLength(2);
    expect(await listAnnotations({ filePath, chapterPath: 'chapter-1' })).toMatchObject([{ id: 'a1', note: 'updated note' }]);

    expect(await removeAnnotation({ filePath, id: 'a1' })).toEqual({ removed: true });
    expect(await removeAnnotation({ filePath, id: 'missing' })).toEqual({ removed: false });
    expect(await listAnnotations({ filePath })).toHaveLength(1);
  });

  it('rejects invalid JSON instead of overwriting the sidecar', async () => {
    const filePath = path.join(tempDir, 'bad.epub');
    await fs.writeFile(getAnnotationSidecarPath(filePath), '{ invalid json', 'utf-8');

    await expect(listAnnotations({ filePath })).rejects.toThrow('Invalid annotation sidecar JSON');
  });
});
