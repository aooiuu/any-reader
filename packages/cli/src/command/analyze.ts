import { Command } from 'commander';
import { createAnalyzerManager } from '@any-reader/core';

export default (program: Command) => {
  program
    .command('analyze')
    .argument('<rule>', '')
    .argument('[result]', '', '')
    .action(async (rule, result) => {
      const res = await createAnalyzerManager().getString(rule, result);
      console.log(res);
    });
};
