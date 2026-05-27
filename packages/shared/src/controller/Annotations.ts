import { Controller, Post } from '../decorators';
import type { AnnotationListParams, AnnotationRemoveParams, AnnotationUpsertParams } from '../utils/annotations';
import { listAnnotations, removeAnnotation, upsertAnnotation } from '../utils/annotations';
import { BaseController } from './BaseController';

@Controller('/annotations')
export class Annotations extends BaseController {
  /**
   * 读取一本书的 annotations，可按章节过滤。
   */
  @Post('list')
  list(data: AnnotationListParams) {
    return listAnnotations(data);
  }

  /**
   * 新增或更新一个 annotation。
   */
  @Post('upsert')
  upsert(data: AnnotationUpsertParams) {
    return upsertAnnotation(data);
  }

  /**
   * 删除一个 annotation。
   */
  @Post('remove')
  remove(data: AnnotationRemoveParams) {
    return removeAnnotation(data);
  }
}
