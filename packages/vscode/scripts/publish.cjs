const { dirname, join } = require('path');
const fs = require('fs-extra');

const root = dirname(__dirname);

async function publish() {
  const pkgPath = join(root, 'package.json');
  const rawJSON = await fs.readFile(pkgPath, 'utf-8');
  const pkg = JSON.parse(rawJSON);
  pkg.name = 'any-reader';

  if (pkg.version.includes('-')) {
    // 非正式版
    const version = pkg.version.replace(/\-.*?$/, '');
    const patch = 10000 + version.split('.').pop();
    pkg.version = pkg.version.replace(/\.\d+\-.*?$/, '.' + patch);
  }
  pkg.devDependencies = {};
  await fs.writeJSON(pkgPath, pkg, { spaces: 2 });
}

publish();
