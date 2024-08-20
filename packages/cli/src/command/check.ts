import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import { SingleBar } from 'cli-progress';
import pLimit from 'p-limit';
import { Rule } from '@any-reader/rule-utils';
import ping from '../utils/ping';
import { timeoutWith } from '../utils/promise';

// TODO: 搜索校验 发现校验
export default (program: Command) => {
  program
    .command('check')
    .description('规则校验')
    .option('-i, --input <string>', '规则文件路径(json)')
    .option('-o, --output <string>', '输出规则文件路径(json)')
    .option('-c, --concurrency <number>', '任务并发数', '10')
    .action(checkRules);
};

type CheckOptions = {
  input: string;
  output: string;
  concurrency: number;
};

async function checkRules(options: CheckOptions) {
  const input = path.resolve(options.input);
  const output = path.resolve(options.output);
  if (!fs.existsSync(input)) {
    console.warn('文件不存在 -> ' + input);
    return;
  }
  if (fs.existsSync(output)) {
    console.warn('文件已存在 -> ' + output);
    return;
  }
  const limit = pLimit(+options.concurrency);
  const rows: Rule[] = JSON.parse(fs.readFileSync(input, 'utf-8'));

  const progressBar = new SingleBar({
    format: '[检查规则] [{bar}] {percentage}% | {value}/{total}'
  });
  progressBar.start(rows.length, 0);
  const validRules: Rule[] = [];

  await Promise.all(
    rows.map((row) =>
      limit(() =>
        timeoutWith(ping(row.host))
          .then((ping: number) => {
            if (ping && ping !== -1) {
              validRules.push(row);
            }
          })
          .catch(() => {})
          .finally(() => {
            progressBar.increment();
          })
      )
    )
  )
    .catch(() => {})
    .finally(() => {
      progressBar.update(rows.length);
      progressBar.stop();
      console.log(`[校验完成] 全部: ${rows.length} 正常: ${validRules.length}`);
      fs.writeFileSync(options.output, JSON.stringify(validRules, null, 4), 'utf-8');
      process.exit();
    });
}
