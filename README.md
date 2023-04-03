# zstore
跨端全局状态管理工具
小程序作为多页应用，订阅发布事件无法在多页之间触达，为了实现小程序的全局状态管理，我们需要将状态维护在 getApp 上，并对其进行监听，通过 getApp 这个统一的内存进行通信，
## 支持

<img alt="browser" src="https://gw.alicdn.com/tfs/TB1uYFobGSs3KVjSZPiXXcsiVXa-200-200.svg" width="25px" height="25px" title="h5" /> <img alt="miniApp" src="https://gw.alicdn.com/tfs/TB1bBpmbRCw3KVjSZFuXXcAOpXa-200-200.svg" width="25px" height="25px" title="阿里小程序" /> <img alt="wechatMiniprogram" src="https://img.alicdn.com/tfs/TB1slcYdxv1gK0jSZFFXXb0sXXa-200-200.svg" width="25px" height="25px" title="微信小程序"> <img alt="bytedanceMicroApp" src="https://gw.alicdn.com/tfs/TB1jFtVzO_1gK0jSZFqXXcpaXXa-200-200.svg" width="25px" height="25px" title="字节跳动小程序">

## 安装

```
tnpm i @zstore/core @zstore/react
```

## 快速开始
### 1.创建你的状态模型

```js
const userInfo = {
  state: {
    name: '小明',
    age: 10
  },
  reducers: {
    foo:(prevState, payload) => prevState.age + payload,
  },
  actions: (dispatch) => ({
    async addAge(num) {
      await delay(1000);
      this.foo(num);
    },
  })
};

const models = {
  userInfo,
};
```

### 2.创建store

```
import { createStore } from "@zstore/core";
const store = createStore({ models, globalSpace: window });
```
### 3.获取模型

```js
import { useSelector } from "@zstore/react";
const Index = function ({ query, history, ...rest }) {
  // 需要将创建的 store 作为参数传入
  const state = useSelector((state) => state?.userInfo)(window.store);
  //...
}
```

### 4.获取 reducers 和 actions 方法

```js
import { useDispatch } from "@zstore/react";
const Index = function ({ query, history, ...rest }) {
  const { setState, foo } = useDispatch("userInfo")(window.store);
  //...
}
```
这里内置了两个 reducers 方法，可以直接取来使用：
#### setState
用来改变 store 中存储的状态，并触发更新。
内部实现等于如下reducer的实现：
```js
setState = (state: State, payload: any) => {
  return {
    ...state,
    ...payload,
  };
};
```

#### setStateNoRefresh
用来改变 store 中存储的状态，并不触发更新。
使用方法和 setState 一样，唯一的区别是不会触发监听更新。

> 注意：为了避免在多人开发时，已经使用的情况下被误覆盖，setState 和 setStateNoRefresh 方法是不允许被覆盖的，也就是说如果你在 reducers 中声明了同名的 setState，那么你声明的那个setState 将会被覆盖掉。

## API
### createStore
用来创建store实例的方法。
#### 参数
|属性名|类型|含义|
|:--|:--|:--|
|models|object|用户创建的models|
|globalSpace|object|可以全局访问的对象|
|storageKey|string|storage 存储 Key 自定义标识|

### models
models是用户定义的对象，key作为mdel的唯一名称，通过key来获取对应的model；
value是指定的结构，有三个属性：
#### state
`any`
用户定义的模型初始状态
eg:

```js
const userInfo = {
  state: {
    name: '小明',
    age: 10
  }
};
```

#### reducers
` { [string]: (state, payload) => any }`
一个改变该模型状态的函数集合。这些方法以模型的上一次 state 和一个 payload 作为入参，在方法中使用可变的方式来更新状态。 这些方法应该是仅依赖于 state 和 payload 参数来计算下一个 state 的纯函数。对于有副作用的函数，请使用 actions。
eg:

```js
const userInfo = {
  state: {
    name: '小明',
    age: 10
  },
  reducers: {
    foo:(prevState, payload) => prevState.age + payload,
  }
};
```

#### actions
`(dispatch) => ({ [string]: (payload, rootState) => void })`
一个可以处理该模型副作用的函数集合。这些方法以 payload 和 rootState 作为入参，适用于进行异步调用、模型联动等场景。在 actions 内部，通过调用 this.foo 来更新模型状态：
eg:

```js
const userInfo = {
  state: {
    name: '小明',
    age: 10
  },
  reducers: {
    foo:(prevState, payload) => prevState.age + payload,
  },
  actions: (dispatch) => ({
    async addAge(num, rootState) {
      await delay(1000);
      this.foo(num);
    },
  })
};

```
> ps: 如果actions和reducers重名，则以reducers为先。
你可以在actions里调用其它model的reducers和actions方法，eg：

```js
const userInfo = {
  state: {
    name: '小明',
    age: 10
  },
  reducers: {
    foo:(prevState, payload) => prevState.age + payload,
  },
};
const person = {
  state: {
    name: '小明',
    age: 10
  },
  actions: (dispatch) => ({
    addAge(num, rootState) {
      dispatch.userInfo.foo(num);
    },
  })
};
```
### useSelector

`<T extends Models, S>(selector: (state: TStates<T>) => any, options?: Options) => (store: TStores<T>) => state`
#### Options

|属性名|类型|含义|
|:--|:--|:--|
|equalityFn|<T>(a: T, b: T) => boolean|比较方法|
|sign|any|监听标识|
|callback|({ value }: CallbackArgs) => void|更新回调|

通过该 hooks 获取store 指定的数据，你可以精准的指定获取某一个属性。且每次调用改方法时，会注册当前页面监听的属性，只有在监听的属性发生变动时，才会触发当前页面的rerender。
eg:

```js
const name = useSelector((state) => state?.userInfo.name, {})(window.store);
```

因为有了这一机制，我们可以精准更新依赖组件，性能更佳。

我们将每个模型的state都存在你传入的globalSpace.state上，

不要直接修改他们，因为这样会使得你的代码不可维护，引起变更的地方变得不可控。像下边这样，这同样可以触发使用到他们的页面的rerender，
eg:

```js
// 不要这样做
globalSpace.state.userInfo.name = '李三';
```

### useDispatch

`(moduleName: string) => Setter`
通过该 hooks 获取store 指定的 reducer 或者 action 方法，默认会有 setState, setStateNoRefresh 方法。
eg:

```js
const { setState, foo } = useDispatch('userInfo')(window.store);
```
## store 上的方法

### store.setState

`(path: string | string[], value) => void`
通过该方法，可以直接更新 store，当 path 传 'root' 时，直接更新整个 store 根节点，各个更新监听会被正常触发

### store.getState

`(path: string | string[]) => void`
通过该方法，可以获取 store 指定节点内容，当 path 传 '' 时，直接返回整个 store 根节点的内容

### store.emitter.register

`(key: 'storeChange', cb: ({newV, key, unRerenderPage}) => void) => void`
通过该方法，可以监听 store 的每次更新

### store.emitter.emit

`(key: 'storeChange', obj: {newV, key, unRerenderPage}) => void`
通过该方法，可以触发 storeChange 的所有监听

## typescript类型
useDispatch 方法接受 models，可以对模型的reducers、actions方法做出提示，eg：

```js
import { useDispatch } from "@zstore/react";
import models from 'models';

const Index = function ({ ...props }) {
  const { setState, foo } = useDispatch<typeof models, 'example'>('example')(window.store);// 这里可以获得提示
  //...
}
export default Index;
```
## 中间件

```js
const timeMiddleware = ({getState}) => (next) => (action) => {
  console.log('time',action, new Date().getTime());
  next(action);
}
```