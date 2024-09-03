import { Command } from 'commander';

import useWeb from './command/web';
import useRuleEncode from './command/rule-encode';
import useRuleDecode from './command/rule-decode';
import useCheck from './command/check';
import useAnalyze from './command/analyze';

async function main() {
  const program = new Command();

  useWeb(program);
  useRuleEncode(program);
  useRuleDecode(program);
  useCheck(program);
  useAnalyze(program);

  await program.parseAsync(process.argv);
}

main();
