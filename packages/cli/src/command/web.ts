import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import { start } from '@any-reader/server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), '..');

export default (program: Command) => {
  program
    .command('web', { isDefault: true })
    .description('启用一个 WEB 服务')
    .option('-p, --port <string>', '端口', '8898')
    .action((options: any) => {
      const port = +options.port;
      start(port, resolve(__dirname, 'public'));
      console.log(`http://localhost:${port}/`);
    });
};
