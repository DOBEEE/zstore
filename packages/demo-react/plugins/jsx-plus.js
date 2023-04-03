import { createFilter } from '@rollup/pluginutils';
import { transformSync } from '@babel/core';

// Babel plugins list for jsx plus
const babelPlugins = ['babel-plugin-react-directives'];

export default function jsxPlusPlugin() {
  return {
    name: 'vite-plugin-react-directives',
    enforce: 'pre',

    transform(code, id) {
      const filter = createFilter(/\.[jt]sx$/);

      if (filter(id)) {
        if (id.endsWith('.tsx')) {
          babelPlugins.push([
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            '@babel/plugin-transform-typescript',
            { isTSX: true, allowExtensions: true },
          ]);
        }

        const result = transformSync(code, {
          babelrc: false,
          ast: true,
          plugins: babelPlugins,
          sourceMaps: true,
          sourceFileName: id,
          configFile: false,
        });

        return {
          code: result.code,
          map: result.map,
        };
      }
    },
  };
}
