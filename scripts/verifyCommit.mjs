// @ts-nocheck

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import chalk from 'chalk';

const dirname = path.dirname(fileURLToPath(import.meta.url), '..');
const msgPath = path.resolve(dirname, '../.git/COMMIT_EDITMSG');
const msg = readFileSync(msgPath, 'utf-8').trim();

const commitRE = /^(revert: )?(feat|fix|docs|style|refactor|perf|test|ci|chore|types|wip)(\(.+\))?: .{1,50}/;

if (!commitRE.test(msg)) {
  console.log();
  console.error(
    `  ${chalk.bgRed.white(' 错误 ')} ${chalk.red('提交信息格式错误.')}\n\n${chalk.red('  例子:\n\n')}    ${chalk.green('feat: 添加了某个功能')}\n` +
      `    ${chalk.green('fix(模块A): 修复了某个功能')}\n`
  );
  // eslint-disable-next-line no-undef
  process.exit(1);
}
