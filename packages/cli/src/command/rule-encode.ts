import { Command } from 'commander';
import { encodeRule } from '@any-reader/rule-utils';

export default (program: Command) => {
  program
    .command('rule-encode')
    .argument('<string>', '规则 JSON')
    .description('规则编码')
    .action((options: any) => {
      console.log(encodeRule(options));
    });
};
