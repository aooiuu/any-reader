import { Command } from 'commander';
import useWeb from './command/web';
import useRuleEncode from './command/rule-encode';
import useRuleDecode from './command/rule-decode';

const program = new Command();

useWeb(program);
useRuleEncode(program);
useRuleDecode(program);

program.parse(process.argv);
