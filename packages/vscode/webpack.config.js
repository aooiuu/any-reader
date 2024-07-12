//@ts-check

'use strict';
const webpack = require('webpack');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const path = require('path');

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
const extensionConfig = {
  target: 'node', // vscode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
  mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')

  entry: './src/extension.ts', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
  output: {
    // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2'
  },
  ignoreWarnings: [
    { module: /node_modules\/typeorm\/util\/ImportUtils\.js/ },
    {
      module: /node_modules\/typeorm\/util\/DirectoryExportedClassesLoader\.js/
    },
    { module: /node_modules\/typeorm\/platform\/PlatformTools\.js/ },
    {
      module: /node_modules\/typeorm\/connection\/ConnectionOptionsReader\.js/
    }
  ],
  externals: {
    sqlite3: 'commonjs sqlite3',
    vscode: 'commonjs vscode' // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
    // modules added here also need to be added in the .vscodeignore file
  },
  resolve: {
    // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
    extensions: ['.ts', '.js']
  },
  module: { rules: [{ test: /\.ts$/, exclude: /(node_modules|bin)/, use: ['ts-loader'] }] },
  devtool: 'nosources-source-map',
  plugins: [
    // @ts-ignore
    new FilterWarningsPlugin({
      exclude: [
        /mongodb/,
        /mssql/,
        /mysql/,
        /mysql2/,
        /oracledb/,
        /pg/,
        /pg-native/,
        /pg-query-stream/,
        /react-native-sqlite-storage/,
        /redis/,
        /sqlite3/,
        /sql.js/,
        /typeorm-aurora-data-api-driver/,
        /hdb-pool/,
        /spanner/,
        /hana-client/,

        /original-fs/
      ]
    }),

    new webpack.ContextReplacementPlugin(/keyv/)
  ],
  infrastructureLogging: {
    level: 'log' // enables logging required for problem matchers
  }
};
module.exports = [extensionConfig];
