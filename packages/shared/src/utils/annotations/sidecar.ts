import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import type { AnnotationFile, AnnotationListParams, AnnotationRemoveParams, AnnotationUpsertParams, ReaderAnnotation } from './types';

const ANNOTATION_SCHEMA_VERSION = 1;
const SIDECAR_SUFFIX = '.any-reader.annotations.json';

function splitFilePath(filePath: string) {
  const lastSlash = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'));
  if (lastSlash < 0) {
    return {
      dir: '',
      separator: path.sep,
      base: filePath
    };
  }

  return {
    dir: filePath.slice(0, lastSlash),
    separator: filePath[lastSlash],
    base: filePath.slice(lastSlash + 1)
  };
}

function createEmptyAnnotationFile(filePath: string): AnnotationFile {
  const { base } = splitFilePath(filePath);
  return {
    schemaVersion: ANNOTATION_SCHEMA_VERSION,
    sourceFile: filePath,
    sourceName: base,
    updatedAt: new Date().toISOString(),
    annotations: []
  };
}

async function exists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function atomicWriteJson(filePath: string, data: AnnotationFile) {
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  const json = `${JSON.stringify(data, null, 2)}\n`;
  await fs.writeFile(tempPath, json, 'utf-8');
  await fs.rename(tempPath, filePath);
}

function assertAnnotationFileShape(data: any, sidecarPath: string): AnnotationFile {
  if (!data || typeof data !== 'object' || !Array.isArray(data.annotations)) {
    throw new Error(`Invalid annotation sidecar: ${sidecarPath}`);
  }

  return {
    schemaVersion: ANNOTATION_SCHEMA_VERSION,
    sourceFile: String(data.sourceFile || ''),
    sourceName: String(data.sourceName || ''),
    updatedAt: String(data.updatedAt || ''),
    annotations: data.annotations as ReaderAnnotation[]
  };
}

/**
 * 返回 EPUB 对应的 sidecar 路径，格式为 `<book>.epub.any-reader.annotations.json`。
 */
export function getAnnotationSidecarPath(filePath: string) {
  const { dir, separator, base } = splitFilePath(filePath);
  const sidecarName = `${base}${SIDECAR_SUFFIX}`;
  return dir ? `${dir}${separator}${sidecarName}` : sidecarName;
}

/**
 * 读取 annotation sidecar；文件不存在时返回空结构，JSON 损坏时抛出错误避免覆盖数据。
 */
export async function readAnnotationFile(filePath: string): Promise<AnnotationFile> {
  const sidecarPath = getAnnotationSidecarPath(filePath);
  if (!(await exists(sidecarPath))) return createEmptyAnnotationFile(filePath);

  const raw = await fs.readFile(sidecarPath, 'utf-8');
  try {
    return assertAnnotationFileShape(JSON.parse(raw), sidecarPath);
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error(`Invalid annotation sidecar JSON: ${sidecarPath}`);
    throw error;
  }
}

/**
 * 写入完整 annotation sidecar，使用临时文件和 rename，避免半写入文件被读取。
 */
export async function writeAnnotationFile(filePath: string, data: AnnotationFile): Promise<AnnotationFile> {
  const sidecarPath = getAnnotationSidecarPath(filePath);
  const parentDir = splitFilePath(sidecarPath).dir;
  if (parentDir) await fs.mkdir(parentDir, { recursive: true });

  const nextData: AnnotationFile = {
    ...data,
    schemaVersion: ANNOTATION_SCHEMA_VERSION,
    sourceFile: filePath,
    sourceName: splitFilePath(filePath).base,
    updatedAt: new Date().toISOString()
  };
  await atomicWriteJson(sidecarPath, nextData);
  return nextData;
}

/**
 * 按书和可选章节读取 annotations。
 */
export async function listAnnotations(params: AnnotationListParams): Promise<ReaderAnnotation[]> {
  const data = await readAnnotationFile(params.filePath);
  if (!params.chapterPath) return data.annotations;
  return data.annotations.filter((annotation) => annotation.target.chapterPath === params.chapterPath);
}

/**
 * 新增或更新一个 annotation，并刷新 createdAt/updatedAt。
 */
export async function upsertAnnotation(params: AnnotationUpsertParams): Promise<ReaderAnnotation> {
  const data = await readAnnotationFile(params.filePath);
  const now = new Date().toISOString();
  const existing = data.annotations.find((annotation) => annotation.id === params.annotation.id);
  const nextAnnotation: ReaderAnnotation = {
    ...params.annotation,
    createdAt: existing?.createdAt || params.annotation.createdAt || now,
    updatedAt: now
  };

  data.annotations = existing
    ? data.annotations.map((annotation) => (annotation.id === nextAnnotation.id ? nextAnnotation : annotation))
    : [...data.annotations, nextAnnotation];

  await writeAnnotationFile(params.filePath, data);
  return nextAnnotation;
}

/**
 * 删除指定 annotation，返回是否真的删除了数据。
 */
export async function removeAnnotation(params: AnnotationRemoveParams): Promise<{ removed: boolean }> {
  const data = await readAnnotationFile(params.filePath);
  const previousLength = data.annotations.length;
  data.annotations = data.annotations.filter((annotation) => annotation.id !== params.id);
  const removed = data.annotations.length !== previousLength;
  if (removed) await writeAnnotationFile(params.filePath, data);
  return { removed };
}
