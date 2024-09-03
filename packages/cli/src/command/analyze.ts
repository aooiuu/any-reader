import { Command } from 'commander';
import { createAnalyzerManager } from '@any-reader/core';

export default (program: Command) => {
  program
    .command('analyze')
    .description('测试规则字符串')
    .argument('<rule>', '规则字符串, 比如 `@js:1+1@js:result * result`')
    .argument('[result]', 'result变量', '')
    .action(async (rule, result) => {
      const res = await createAnalyzerManager().getString(rule, result);
      console.log(res);
    });
};
