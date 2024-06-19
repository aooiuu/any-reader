const path = require('node:path')
const fse = require('fs-extra')

function makeRubick(config = {}) {
  const root = path.dirname(__dirname)
  const rubickPublic = path.resolve(root, 'public')
  const rootPkg = fse.readJSONSync(path.join(root, 'package.json'))
  fse.copySync(path.resolve(root, '..', 'utools', 'public'), rubickPublic)

  const utoolsPkg = fse.readJSONSync(path.join(rubickPublic, 'plugin.json'))

  let outPkg = Object.keys(rootPkg).reduce((p, v) => {
    p[v] = utoolsPkg[v] || rootPkg[v]
    return p
  }, {})

  outPkg = Object.assign(
    {},
    outPkg,
    {
      private: false,
      homePage: rootPkg.repository?.url,
      pluginType: 'ui',
      files: [
        'template',
        'logo.png',
      ],
    },
    config,
  )

  fse.writeJSONSync(path.join(rubickPublic, 'package.json'), outPkg, { spaces: 2 })

  // fix preload
  fse.moveSync(path.resolve(rubickPublic, 'libs'), path.resolve(rubickPublic, 'template', 'libs'))
  fse.moveSync(path.resolve(rubickPublic, 'preload.js'), path.resolve(rubickPublic, 'template', 'preload.js'))
}

makeRubick({
  pluginType: 'ui',
  name: 'any-reader-rubick',
})
