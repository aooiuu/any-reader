import type { Repository } from 'typeorm';
import type { ChapterHistory } from '../entity/ChapterHistory';

export class ChapterHistoryService {
  repository: Repository<ChapterHistory>;

  constructor(repository: Repository<ChapterHistory>) {
    this.repository = repository;
  }

  // 更新记录
  async save(data: IUpdate) {
    let row = await this.repository.findOneBy({
      ruleId: data.ruleId,
      filePath: data.filePath,
      chapterPath: data.chapterPath
    });
    if (!row) {
      row = this.repository.create({
        ...data,
        id: undefined
      });
      row.createTime = Date.now();
    }
    row.updateTime = Date.now();
    if (data.percentage) row.percentage = data.percentage;
    await this.repository.save(row);
  }

  // 读取记录
  async list(data: IFind) {
    return await this.repository.find({
      where: data,
      order: {
        updateTime: 'DESC'
      }
    });
  }
}

export interface IUpdate {
  ruleId: string;
  filePath: string;
  chapterPath: string;
  percentage: number;
}

export interface IFind {
  ruleId: string;
  filePath: string;
}
