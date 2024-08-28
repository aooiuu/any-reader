/**
 * 处理调试
 * https://github.com/privatenumber/tsx/issues/485
 */

import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { getFormat, load, resolve as resolveTs, transformSource } from 'ts-node/esm';
import * as tsConfigPaths from 'tsconfig-paths';

export { getFormat, transformSource, load };

const { absoluteBaseUrl, paths } = tsConfigPaths.loadConfig();
const matchPath = tsConfigPaths.createMatchPath(path.resolve(absoluteBaseUrl, '../../'), paths);

export function resolve(specifier, context, defaultResolver) {
  const mappedSpecifier = matchPath(specifier);

  if (mappedSpecifier) {
    specifier = mappedSpecifier;
    const url = specifier.startsWith('file:') ? specifier : pathToFileURL(specifier.toString());
    return resolveTs(url.toString(), context, defaultResolver);
  } else {
    return resolveTs(specifier, context, defaultResolver);
  }
}
