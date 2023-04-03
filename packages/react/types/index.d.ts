/// <reference path="./interface.d.ts" />

export type SFCProps<T extends Models> = FCProps<T>;
export type Store<T extends Models> = TStores<T>;

export const useSelector: <T extends Models, S>(selector: (state: TStates<T>) => any, options?: Options) => (
  store: TStores<T>
) => S;

export const useDispatch: <T extends Models, K extends keyof T>(moduleName: K) => (store: TStores<T>) => TSetter<T[K]>;
export const useStore: (initialState: any) => [any, (val: any) => void];
export const connect: <T extends Models>(TarComponent: React.FC<FCProps<T>>) => (store: TStores<T>) => (props: any) => JSX.Element;
export const storeConnect: <T extends Models>(TarComponent: React.FC<FCProps<T>>) => (props: any) => JSX.Element;
export const storeComponentConnect: <T extends Models>(TarComponent: React.FC<FCProps<T>>) => (store: TStores<T>) => (props: any) => JSX.Element;

