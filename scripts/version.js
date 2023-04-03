import { globbySync } from 'globby';
import path from 'path';
import fse from 'fs-extra';
import { execSync } from 'child_process';
import chalk from 'chalk';
import { getLatestVersion } from 'ice-npm-utils';

const appendPackageJson = (pattern) => `${pattern}/package.json`;
const rootDir = process.cwd();

(async () => {
  // 1. exec lerna changed

  let contentChanged = null;
  try {
    contentChanged = execSync('npm run lerna-changed').toString('utf-8');
  } catch (e) {
    if (e.message.includes('No changed packages found')) {
      throw new Error('没有检测到代码改动！');
    }
    throw e;
  }

  // 2. 确认当前包的版本号是否发布，否则不执行 lerna version
  const packages = fse.readJSONSync(path.join(rootDir, 'lerna.json')).packages;

  const pattern = packages ? packages.map(appendPackageJson) : ['*/**/package.json'];
  const allPackagesPath = globbySync(pattern, {
    cwd: rootDir,
    ignore: [
      '**/node_modules/**',
      '**/examples/**',
      '**/demo?(s)/**',
      '**/doc?(s)/**',
      '**/(build|dist)/**',
    ],
    onlyFiles: true,
  });

  const mayPublishedPackages = allPackagesPath
    .map((pkg) => {
      const pkgInfo = fse.readJSONSync(path.join(rootDir, pkg));

      return {
        name: pkgInfo.name,
        version: pkgInfo.version,
      };
    })
    .filter(({ name }) => contentChanged.includes(name));

  const shouldRunVersion = await Promise.all(
    mayPublishedPackages.map(async ({ name, version }) => {
      try {
        const latestVersion = await getLatestVersion(name);
        return latestVersion === version;
      } catch (e) {
        // 考虑 package 从未发布
        return false;
      }
    }),
  ).then((dections) => dections.some(Boolean));

  // 3. 根据判断结果执行
  if (shouldRunVersion) {
    execSync('npm run lerna-version -- --ignore-scripts', { stdio: 'inherit' });
  } else {
    console.log(chalk.red('检测到待发布的包已更新了版本，请直接发布！'));
  }
})().catch((e) => {
  console.log(chalk.red(e.message));
  console.trace(e);
  process.exit(1);
});
