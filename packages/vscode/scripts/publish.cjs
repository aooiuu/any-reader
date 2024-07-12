const { dirname, join } = require('path');
const fs = require('fs-extra');

const root = dirname(__dirname);

async function publish() {
  const pkgPath = join(root, 'package.json');
  const rawJSON = await fs.readFile(pkgPath, 'utf-8');
  const pkg = JSON.parse(rawJSON);
  pkg.name = 'any-reader';
  pkg.devDependencies = {};
  await fs.writeJSON(pkgPath, pkg, { spaces: 2 });
}

publish();
