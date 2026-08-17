/**
 * 阅读批注。
 */
import type {
  AnnotationListParams,
  AnnotationRemoveParams,
  AnnotationUpsertParams,
  ReaderAnnotation
} from '../../../../shared/src/utils/annotations/types';
import { request } from '@/utils/request';

/**
 * 读取一本书的 annotations，可按章节过滤。
 */
export function listAnnotations(data: AnnotationListParams) {
  return request<ReaderAnnotation[]>({
    method: 'post',
    url: 'annotations/list',
    data
  });
}

/**
 * 新增或更新一个 annotation。
 */
export function upsertAnnotation(data: AnnotationUpsertParams) {
  return request<ReaderAnnotation>({
    method: 'post',
    url: 'annotations/upsert',
    data
  });
}

/**
 * 删除一个 annotation。
 */
export function removeAnnotation(data: AnnotationRemoveParams) {
  return request<{ removed: boolean }>({
    method: 'post',
    url: 'annotations/remove',
    data
  });
}
