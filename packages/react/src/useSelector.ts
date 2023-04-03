/* eslint-disable react-hooks/rules-of-hooks */
import { useReducer, useRef, useEffect } from 'react';
import { isNode } from '@uni/env';

const defaultEqualityFn = <T>(a: T, b: T) => a === b;
const useSelect = <T extends Models, S>(
  store: TStores<T>,
  selector: (state: TStates<T>) => S,
  options: Options
): S => {
  if (isNode) {
    // 兼容 ssr
    return null;
  }
  const { equalityFn = defaultEqualityFn, sign = '', callback } = options || {};
  const [, forceRender] = useReducer((s) => s + 1, 0);
  const selectedState = selector(store.getState());
  const latestSelectedState = useRef(JSON.stringify(selectedState));
  useEffect(() => {
    const unRegister = store.emitter.register(
      'storeChange',
      ({ newV, path, unRerenderPage }: EventParams) => {
        if (unRerenderPage === 'unRerender' || unRerenderPage === 'all') {
          return;
        }
        if (unRerenderPage && equalityFn(sign, unRerenderPage)) {
          return;
        }
        const value = selector(store.getState());
        if (equalityFn(JSON.stringify(value), latestSelectedState.current)) {
          return;
        }
        latestSelectedState.current = JSON.stringify(value);
        callback && callback({ value });
        forceRender();
      }
    );
    return unRegister;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return selectedState;
};
export default <T extends Models, S>(selector: (state: TStates<T>) => any, options?: Options) => (
  store: TStores<T>
) => useSelect<T, S>(store, selector, options);
