/* eslint-disable no-param-reassign */
import { get, set, deepCopy, compose } from './utils';
import watch from './utils/watch';
import Emitter from './utils/event';
import { BroadcastChannel } from 'broadcast-channel';
import { isNode, isWeb } from '@uni/env';

const getDispatch = <T extends Models>(
  models: TModels<T>,
  globalSpace: Global<Models>,
  getState: () => TStates<Models>,
  middlewares: any[] = []
) => {
  // dispatch
  const dispatchs: TDispatchs<T> = {};
  let dispatch = ({ type, modelName, payload, unRerenderPage }: any) => {
    const state = getState();
    // 每次传入的state必须是深拷贝过的，不会影响公共的store
    const data = deepCopy(state[modelName]);
    const res = models[modelName].reducers[type].call(dispatchs[modelName], data, payload);
    globalSpace.state[modelName] = {
      unRerenderPage: type === 'setStateNoRefresh' ? 'all' : unRerenderPage,
      _agro_store_result: res,
    };
  };
  // 注册 middlewares
  if (middlewares.length > 0) {
    const chain = middlewares.map((i) => i({ getState }));
    dispatch = compose(...chain)(dispatch)
  }

  Object.entries(models).forEach(([key, value]) => {
    const reducers: any = {};
    const actions: any = {};
    // eslint-disable-next-line no-param-reassign
    value.reducers.setState = (state: State, payload: any) => {
      return {
        ...state,
        ...payload,
      };
    };
    value.reducers.setStateNoRefresh = (state: State, payload: any) => {
      return {
        ...state,
        ...payload,
      };
    };

    Object.entries(value.reducers).forEach(([k, reducer]) => {
      reducers[k] = (payload: State, unRerenderPage: any) => {
        dispatch({ type: k, modelName: key, payload, unRerenderPage });
      };
    });
    const _actions: Actions = value.actions(dispatchs);

    // actions 如果需要指定不触发页面更新，需要对内部reducer的调用传入 unRerenderPage
    Object.entries(_actions).forEach(([k, action]) => {
      actions[k] = (payload: State) => {
        const state = getState();
        return action.call(dispatchs[key], payload, deepCopy(state[key]));
      };
    });
    (dispatchs as any)[key] = {
      ...reducers,
      ...actions,
    };
  });
  return dispatchs;
};
export const getClassProvider = <T extends Models>(store: TStores<T>) => {
  const { models, dispatchs, getState } = store;
  const res: any = {};
  for (const key in models) {
    if (Object.prototype.hasOwnProperty.call(models, key)) {
      res[key] = {
        state: getState(key),
        ...dispatchs[key],
      };
    }
  }
  return res;
};

export default <T extends Models>({
  globalSpace,
  models,
  storageKey = '',
  middlewares,
}: CreateStoreProps<T>): TStores<T> => {
  if (!models || Object.prototype.toString.call(models) !== '[object Object]') {
    throw Error(
      'The type of models must be object, but get ' + Object.prototype.toString.call(models)
    );
  }
  if (!globalSpace) {
    globalSpace = {};
  }
  if (!globalSpace?.state) {
    globalSpace.state = {};
    Object.entries(models).forEach(([key, value]) => {
      (globalSpace.state as any)[key] = value.state;
    });
  }
  const emitter = new Emitter();

  if (!isNode && isWeb) {
    // 支持 mpa、spa 的数据共享
    if (localStorage.getItem(`__agro_store_local_key_${storageKey}`)) {
      globalSpace.state = {
        ...globalSpace.state,
        ...JSON.parse(localStorage.getItem(`__agro_store_local_key_${storageKey}`)),
      };
    } else {
      localStorage.setItem(
        `__agro_store_local_key_${storageKey}`,
        JSON.stringify(globalSpace.state)
      );
    }
    const channel: BroadcastChannel = new BroadcastChannel('__agroStoreChange__');
    window.sessionStorage.setItem('__agro_store_local_sign_', String(+new Date()));
    watch(globalSpace, 'state', (newV: any, path: string, unRerenderPage: any, noPost: boolean) => {
      if (!path) {
        return;
      }
      emitter.emit('storeChange', { newV, path, unRerenderPage });
      // 更新 storage
      localStorage.setItem(
        `__agro_store_local_key_${storageKey}`,
        JSON.stringify(globalSpace.state)
      );
      !noPost &&
        channel.postMessage({
          path,
          value: newV,
          pageSign: window.sessionStorage.getItem('__agro_store_local_sign_'),
          unRerenderPage,
        });
    });
    channel.onmessage = (res: {
      value: any;
      path: string;
      pageSign: string;
      unRerenderPage: boolean;
    }) => {
      const { path, value, pageSign, unRerenderPage } = res;
      if (!path) {
        return;
      }
      // ===storeChangeon
      // 通过 sessionStorage 区分触发更新的是否在相同窗口
      const currentPageSign = window.sessionStorage.getItem('__agro_store_local_sign_');
      if (pageSign === currentPageSign) {
        // ===收到同一个session窗口的消息，直接return
        return;
      }
      const _path = path.split('.');
      _path[0] = 'state';
      // 收到其他页面来的更新，不需要重新发布更新消息 noPost 为 true
      const newValue = unRerenderPage
        ? { unRerenderPage, _agro_store_result: value, noPost: true }
        : { noPost: true, _agro_store_result: value };
      if (JSON.stringify(get(globalSpace, _path)) === JSON.stringify(value)) {
        return;
      }
      set(globalSpace, _path, newValue);
    };
  } else {
    watch(globalSpace, 'state', (newV: any, path: string, unRerenderPage: any) => {
      emitter.emit('storeChange', { newV, path, unRerenderPage });
    });
  }
  const getState = (path?: string | string[]) => {
    if (!path) {
      return globalSpace.state;
    }
    return get(globalSpace.state, path);
  };
  const setState = (path: string | string[], val: any) => {
    if (!path) return;
    if (path === 'root') {
      globalSpace.state = val;
      return;
    }
    set(globalSpace.state, path, val);
  };
  const clearStorage = (key: string) => {
    localStorage.setItem(
      `__agro_store_local_key_${storageKey}`,
      JSON.stringify({
        ...JSON.parse(localStorage.getItem(`__agro_store_local_key_${storageKey}`)),
        [key]: {},
      })
    );
  };
  const setStorage = (path: string | string[], val = '') => {
    const currentData = JSON.parse(localStorage.getItem(`__agro_store_local_key_${storageKey}`));
    set(currentData, path, val);
    localStorage.setItem(`__agro_store_local_key_${storageKey}`, JSON.stringify(currentData));
  };
  const clearAllStorage = (_key: string) => {
    localStorage.setItem(`__agro_store_local_key_${storageKey}`, '');
  };

  const dispatchs = getDispatch<T>(models, globalSpace, getState, middlewares);
  const store = {
    setStorage,
    clearStorage,
    clearAllStorage,
    dispatchs,
    getState,
    setState,
    models,
    globalSpace,
    emitter,
  };
  return store;
};
