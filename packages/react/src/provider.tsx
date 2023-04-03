// @ts-nocheck
import {
  createElement,
  useState,
  FC,
  useRef,
  useMemo,
  useContext,
  useEffect,
  cloneElement,
  Children
} from 'react';
import { checkPath, getClassProvider } from './utils';
import useSelector from './useSelector';
import useDispatch from './useDispatch';
// import { State, ContextStore, ProviderProps, EventParams, FCProps } from '../types/interface';

const Provider: FC<ProviderProps<Models>> = ({ children, store, ...rest }) => {
  const { models, Context, globalSpace, emitter } = store;
  const [v, setV] = useState(getClassProvider(store));
  const listeners = useRef([]);
  const _currentPageSign = useRef([]);
  const clearWatch = useRef(null);
  useMemo(() => {
    clearWatch.current = emitter.register(
      'storeChange',
      ({ newV, path, unRerenderPage }: EventParams) => {
        if (unRerenderPage === 'all' || unRerenderPage === _currentPageSign) {
          return;
        }
        if (!path) {
          return;
        }
        listeners.current.some((i) => {
          if (checkPath(i, path)) {
            setV(getClassProvider(store));
            return true;
          }
          return false;
        });
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    return () => {
      clearWatch.current();
    };
  }, []);
  return (
    <Context.Provider value={v}>
      {Children.map(children, (child: React.ReactNode, idx: number) => {
        const newProps: FCProps<any> = {
          ...rest,
          key: idx,
          useSelector: (
            selector: (state: State) => any,
            sign?: any,
            equalityFn?: <T>(a: T, b: T) => boolean
          ) => {
            return useSelector(selector, { equalityFn, sign })(store);
          },
          useStore: (watchPath: string) => {
            if (watchPath !== 'root') {
              const _watchPath = 'root.' + watchPath;
              if (!listeners.current.includes(_watchPath)) {
                listeners.current.push(_watchPath);
              }
              return store.getState(_watchPath);
            }
            return store.getState();
          },
          useDispatch: (modelName: string) => {
            return useDispatch(modelName)(store);
          },
        };
        return cloneElement(child, newProps);
      })}
    </Context.Provider>
  );
};
export default Provider;
