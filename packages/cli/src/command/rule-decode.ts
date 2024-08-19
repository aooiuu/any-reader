import { Command } from 'commander';
import { decodeRule } from '@any-reader/rule-utils';

export default (program: Command) => {
  program
    .command('rule-decode')
    .argument('<string>', '规则解码')
    .description('规则解码')
    .action((options: any) => {
      console.log(decodeRule(options));
    });
};
