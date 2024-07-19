const { dirname, join } = require('path');
const fs = require('fs-extra');
const path = require('path');

const root = dirname(__dirname);

function parseVersion(version) {
  const match = version.match(/^v?(\d{1,5})\.(\d{1,5})\.(\d{1,5})(?:-([0-9A-Za-z]+))?(?:\.([0-9A-Za-z-.]+))?$/);
  if (!match) {
    throw new Error('Unable to parse: ' + version);
  }
  var res = {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    pre: match[4] || '',
    build: parseInt(match[5], 10)
  };

  return res;
}

async function publish() {
  const pkgPath = join(root, 'package.json');
  const rawJSON = await fs.readFile(pkgPath, 'utf-8');
  const pkg = JSON.parse(rawJSON);
  pkg.name = 'any-reader';

  if (pkg.version.includes('-')) {
    // 非正式版
    const version = parseVersion(pkg.version);
    pkg.version = pkg.version.replace(/\.\d+\-.*?$/, '.' + (10000 + version.build));
  }

  // sql-wasm.wasm
  fs.copyFileSync(path.resolve(root, '../../node_modules/sql.js/dist/sql-wasm.wasm'), path.join(root, 'dist', 'sql-wasm.wasm'));

  pkg.devDependencies = {};
  await fs.writeJSON(pkgPath, pkg, { spaces: 2 });
}

publish();
