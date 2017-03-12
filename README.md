# Nearly

一个简洁, 强大的数据流框架;

## 安装

```
npm install --save nearly-react
```

## 特性

![data-flow](https://github.com/luojunbin/nearly/blob/master/doc/flux-diagram-white-background.png)

上图为 [flux](http://facebook.github.io/flux/docs/overview.html#content) 架构图, Nearly 参考自 [flux](http://facebook.github.io/flux/docs/overview.html#content), 在其基础上做了以下简化和改进:

#### 架构上:

1. 以 JS 模块为单位创建 `Store`, 并对使用者屏蔽了 `Store` 的存在, 省略了手动创建 `Store` 的过程;
- 将 JS 模块 `export` 的方法默认注册为 `Dispatcher`, 省略了手动注册 `Dispatcher` 的过程;
- 在 `Dispatcher` 之上增加了 `Parser` 结构, 用于解析传入的具有约定结构的 `actions`, 使之映射到唯一的 `Store` 和 `Dispatcher`;

#### 功能上:

1. 集成 `Promise`, 我们不再需要多写一个 `componentDidMount` 方法去异步获取数据, 更多情况下, 我们将使用 `stateless component` 让代码更加简洁;
-  `Store` 的使用更加灵活, `Store` 的单实例和多实例使用能很巧妙地实现跨组件通信和通用组件控制逻辑的复用;

#### 相比 [flux](http://facebook.github.io/flux/docs/overview.html#content):

1. API 更加简洁, 在业务中一般只会用到 `connect` 和 `dispatch` 方法;
-  对状态进行集中管理, 写法与原始的 `React` 相似, 学习和迁移成本低;
-  更轻量, min 后只有 6K;

## 使用示例

> 目录结构

```
/app
    /actions
        counter.js
    /components
        Counter.js
    index.js
    nearly-config.js
```

> /actions/counter.js

```js
/**
 * @file Dispatcher File, 将与 /components/Counter.js 组合
 */

// 必须实现 init 方法, 它将被隐式调用, 作用是初始化 state
export function init() {
    return {
        count: 0
    };
}

export function add(getState, step) {
    return {
        count: getState().count + step
    };
}
```

> /components/Counter.js

```js
/**
 * @file 木偶组件, 将与 /actions/counter.js 组合
 */

import React from 'react';
import {connect, dispatch} from 'nearly-react';

// 'counter::add' 经过 Parser 解析后会调用 /actions/counter.js 里的 add 方法
let incr = () => dispatch('counter::add', 1);
let decr = () => dispatch('counter::add', -1);

function Counter(props) {
    return (
        <div>
            <button onClick={incr}> - </button>
            <span>{props.count}</span>
            <button onClick={decr}> + </button>
        </div>
    )
}

// 'counter' 经过 Parser 解析后会加载 /actions/counter.js 模块
// connect 方法将隐式创建一个 `Store`, 并挂载该模块
// 最终返回一个包裹 Counter 且受 `Store` 控制的高阶组件
export default connect('counter', Counter);
```


> /nearly-config.js

```js
/**
 * @file 配置 nearly
 */

import {configure} from 'nearly-react';

configure('parser', {
    // 根据 storeName 去指定路径下加载相应模块
    nrImport(storeName) {
        let realName = storeName('#')[0];
        // 根据模块名, 去 actions 目录下引用相应模块
        return require(`./actions/${realName}.js`);
    }
});
```

> /index.js

```js
/**
 * @file 应用入口
 */

import React from 'react';
import { render } from 'react-dom';
import './nearly-config';
import Counter from './components/Counter';

render(
    <Counter />,
    document.getElementById('root')
)
```

## API

### Dispatcher functions(getState, ...args)
`Dispatcher function` 的第一个参数为 `getState` 方法, 该方法返回的永远是当前最新的 `state`, 其余参数为 `dispatch` 方法所传的参数;

对于 `Dispatcher function` 的返回值:

- 为普通对象时, 返回值直接 merge 进旧 state;
- 为 `Promise` 时, 取 `Promise.prototype.then` 方法里的参数 merge 进旧 state;
- 为 `null` 时, 不 merge, 不触发 render;

例:

> /actions/counter.js 异步版本

```js
/**
 * @file Dispatcher File, 将与 /components/Counter.js 组合
 */

// 必须实现 init 方法, init 中也可以使用 Promise
export function init() {
    return fetch('./test.json').then(res => res.json());
}

// 同步增加
export function add(getState, step) {
    return {
        count: getState().count + step
    };
}

// 异步增加
export function addAsync(getState, step) {
    return new Promise(resolve => {        
        setTimeout(() => {
            // getState 方法返回的永远是最新的 state
            let count = getState().count + step;
            resolve({count})
        }, 1000);
    });
}

// 不触发渲染
export function nothing(getState, step) {
    return null;
}
```


### dispatch(action, ...args)
默认配置的 `action` 格式为 `${storeName}#${id}::${function}`, 

dispatch 会根据 `action` 映射到相应的 `Dispatcher` 方法, 并将 args 作为参数传入 `Dispatcher` 方法, 将方法返回的结果提交给 `Store`, 由 `Store` 触发组件更新;


### connect(storeName, Component [, PlaceHolder])
该方法会根据 `storeName` 查找或创建 `Store`, 再将 `Store`, `Component` 和 `PlaceHolder` 组合, 返回一个高阶组件;

其中, `PlaceHolder` 为默认展示组件 (可选), 当且仅当 `init` 返回 `Promise` 时有效, 在 `Component` 被插入 dom 之前, 组合后的高阶组件会先展示 `PlaceHolder` 组件, 可用于实现 loading 之类的效果;

### configure(type, option)
现阶段 Nearly 只支持对 `parser` 的配置, 通过合理的配置, 分类目录结构和特征目录结构 `Nearly` 都能适应;

`parser` 中可供配置的方法有 `nrImport`, `nrSplit`, `nrTarget`,

- `nrImport` 根据 `storeName` 去加载相应的模块;
- `nrSplit` 将 `action` 分割为 `storeName` 和 `dispatcherName`;
- `nrTarget` 根据加载的模块和 `dispatcherName` 获得相应的方法;

其中, `nrImport` 在 `connect` 时触发, `nrSplit` 和 `nrTarget` 则在 `dispatch` 时触发;

大体流程如下:

```js
function getDispatcher(action) {
    let {storeName, dispatcherName} = parser.nrSplit(action);

    let store = getStore(storeName);

    let dispatcher = parser.nrTarget(store.dispatchers, dispatcherName);
    
    return dispatcher;
}
```

默认配置如下:

```js
import {configure} from 'nearly-react';

configure('parser', {
    // 根据 :: 将 action 分割为 storeName 和 dispatcherName; 
    nrSplit(action) {
        let [storeName, dispatcherName] = action.split('::');
        return {storeName, dispatcherName};
    },

    // 根据 storeName 去指定路径下加载相应模块;
    nrImport(storeName) {
        // '#' 分隔出 id
        let realName = storeName.split('#')[0];
        return require(`./actions/${realName}.js`);
    },
    
    // 从 Store.dispatcherSet 中获得 dispatcher
    nrTarget(dispatcherSet, dispatcherName) {
        let dispatcher = dispatcherSet[dispatcherName];
    
        if (dispatcher) {
            return dispatcher;
        }

        // 可配置一些全局的 Dispatcher, 用于;
        switch (functionName) {
            case 'testState':
                return (getState, state) => state;
        }

        throw Error(`The dispatcher ${functionName} does not exist.`);
    }
}
```

## 进阶使用


### dispatcher(action, ...args)
即 `dispatch` 的高阶函数; 例:

```js
dispatch('counter::add', 1);
等同于: dispatcher('counter::add')(1);

dispatch('test::testAdd', 1, 2, 3, 4);
等同于: dispatcher('test::testAdd', 1, 2)(3, 4);
```


### registerStore(storeName, dispatcherSet)

针对不希望在 `connect` 加载 JS 模块并注册 `Store`, 或是不想改变原有项目目录结构的情况, Nearly 提供了手动注册 `Store` 的 API.

调用该方法后, 在 `connect` 方法中将使用手动注册的 `Store`, 而不会重新注册, 在 `dispatch` 方法中也能直接使用, 例:

```
registerStore('customStore', {
    // 自定义 Store 同样必须实现 init 方法
    init() {
        return {sum: 0};
    },
    add(getState, num) {
        return {sum: getState().sum + num};
    }
});

connect('customStore', Test);

dispatch('customStore::add', 1);
```

### 同一 Store 单实例使用
在业务中我们经常需要跨组件通信, 或者组件间共享数据;

使用 Nearly 我们能很轻易地将两个不同的组件绑定相同的 `Store`, 只要传入 `connect` 的 `storeName` 是相同的即可;
例: 简单的输入同步显示

```js
// /actions/vm.js
export function init() { return { value: '' }; }
export function change(getState, value) { return { value }; }

// /components/Input.js
let change = e => dispatch('vm::change', e.target.value);

function Input(props) {
    return <input value={props.value} onChange={change} />
}
export default connect(Input, 'vm');


// /components/Text.js
function Text(props) {
    return <p>{props.value}</p>
}
export default connect(Text, 'vm');
```
详见示例: [One-store](https://github.com/luojunbin/nearly/tree/master/example/one-store)


### 同一 Store 多实例使用
我们开发通用组件时会需要给同一组件绑定同一 `store` 的不同实例以复用;  可以通过给 `storeName` 加上 `#id` 来区分不同 `Store`;

```js
// Dialog.js
export default function Dialog (props){
    return <div>{props.content}</div>
}

let DialogA = connect(Dialog, 'dialog#a');
let DialogB = connect(Dialog, 'dialog#b');

// 关闭弹窗 A
dispatch('dialog#a::close');
// 关闭弹窗 B
dispatch('dialog#b::close');
```
注意, 当在组件内部使用 `dispatch` 时, 可以通过 `props._storeName` 来确定 `storeName`;

详见示例: [Dialog](https://github.com/luojunbin/nearly/tree/master/example/dialog)


## 示例

- [TodoMVC](https://github.com/luojunbin/nearly/tree/master/example/todomvc)
- [Counter](https://github.com/luojunbin/nearly/tree/master/example/counter)
- [Dialog](https://github.com/luojunbin/nearly/tree/master/example/dialog)
- [One-store](https://github.com/luojunbin/nearly/tree/master/example/one-store)

<!--React-SPA-Template(基于 nearly 的SPA项目模板)-->


## Tips

1. `nearly-config.js` 必须在业务逻辑之前加载;
2. 虽然有 `registerStore` API, 不过作者还是推荐使用 `connect` 来隐式注册 `Store`, 因为 `connect` 通过 `storeName` 映射文件的方式来注册 `Store`, 在确保唯一性的同时更容易维护和 debug;
3. 在 Nearly 中对 `Promise` 的判断是不准确的 *(只要有 `then` 方法均认为是 `Promise` 实例)* , 一方面是因为 Nearly 中只使用了 `then` 方法, 另一方面是为了兼容 `jQuery.Deferred` 等类库;
3. 欢迎提 issue 或是 pr;


