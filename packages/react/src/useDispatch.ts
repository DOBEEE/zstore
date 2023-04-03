import { isNode } from '@uni/env';

export default <T extends Models, K extends keyof T>(moduleName: K) => {
  if (isNode) {
    // 兼容 ssr
    return {};
  }
  return (store: TStores<T>) => store.dispatchs[moduleName];
};
