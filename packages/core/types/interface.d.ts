interface State {
  [key: string]: string | number | boolean | Array<any> | State | any;
}
type Payload = string | number | boolean | Array<any> | State;
interface Query {
  [key: string]: string
}
type Reducer = (state: State, payload: Payload) => any;
interface Reducers {
  [key: string]: Reducer
}
type Action = (payload: Payload, state: State) => any | Promise<any>;
type ActionsFun = (dispatch: Dispatchs) => Actions
type TActionsFun<T extends Models> = (dispatch: TDispatchs<T>) => Actions
interface Actions {
  [key: string]: Action
}
interface Dispatchs {
  [key: string]: Action
}
interface Setter {
  [key: string]: (payload: Payload, unRerenderPage?: any) => void | Promise<any>;
}
type Store = Setter & {
  state: State;
  reducers?: Reducers;
  actions?: Actions;
}
type TSetter<T extends Model> = {[P in keyof T['reducers']]: (payload: Payload) => void | Promise<any>} & {[P in keyof ReturnType<T['actions']>]: (payload: Payload) => void | Promise<any>} & {setState: (state: State, unRerenderPage?: any) => void, setStateOnce: (state: State, unRerenderPage?: any) => void,};
type TDispatchs<T extends Models> = {[P in keyof T]?: TSetter<T[keyof T]>};
type TStore<T extends Models> = TSetter<T[keyof T]> & {
  state: State;
  reducers?: Reducers;
  actions?: Actions;
};
interface RestProps {
  [index:string]: any;
}
type FCProps<T extends Models> = RestProps & {
  history?: any;
  query?: any;
  store?: TStores<T>;
  useAgroStore?: (moduleName: string) => TStore<T>;
  useURAgroStore?: (moduleName: string) => TSetter<T[keyof T]>;
  useURCAgroStore?: (moduleName: string) => TSetter<T[keyof T]>;
}
interface Stores {
  [key: string]: Store;
}
interface TStores<T extends Models> {
  models: TModels<T>;
  globalSpace: Global<T>;
  emitter: any;
  setState: (path: string | string[], val: any) => void;
  getState: (path?: string | string[]) => TStates<T>;
  dispatchs: TDispatchs<T>;
  setStorage: (path: string | string[], val: any) => void;
  clearAllStorage: (_key: string) => void;
}
interface IStore {
  models: Models;
  globalSpace: any;
  emitter: any;
  getState: () => State;
  setState: (path: string | string[], val: any) => void;
  dispatchs: Setter;
}

interface ContextStore {
  [key: string]: Store;
}
interface TModel<T extends Models> {
  state: State;
  readonly reducers?: Reducers;
  readonly actions?: TActionsFun<T>
}
interface TModels<T extends Models> {
  [key: string]: TModel<T>
}
interface Model {
  state: State;
  readonly reducers?: Reducers;
  readonly actions?: ActionsFun
}
interface Models {
  [key: string]: Model
}
interface ProviderProps<T extends Models> {
  store: TStores<T>;
  children: React.ReactChildren;
  [index:string]: any;
}
interface TarComponentProps {
  history?: any;
  query?: any;
  useAgroStore?: (moduleName: string) => Store;
  useSetAgroStore?: (moduleName: string) => Setter;
  [index:string]: any;
}
type TStates<T extends Models> = {[P in keyof T ]?: T[P]['state']};
interface Global<T extends Models> {
  state?: TStates<T>;
  [key: string]: any;
}
interface CreateStoreProps<T extends Models> {
  models: TModels<T>;
  globalSpace: Global<T>;
  storageKey?: string;
  middlewares?: any[];
}
interface EventParams {
  newV: Payload;
  path: string;
  unRerenderPage: any;
}
interface CallbackArgs {
  value: any;
}
interface Options {
  equalityFn?: <T>(a: T, b: T) => boolean;
  sign?: any;
  callback: ({ value }: CallbackArgs) => void;
}