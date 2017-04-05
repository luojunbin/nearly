# Nearly

一个简洁, 强大的数据流框架;

## 安装

```
npm install --save nearly-react
```

## 特性

![data-flow](https://github.com/luojunbin/nearly/blob/master/doc/flux-diagram-white-background.png)

上图为 [flux](http://facebook.github.io/flux/docs/overview.html#content) 架构图, Nearly 参考自 [flux](http://facebook.github.io/flux/docs/overview.html#content), 在其基础上做了以下简化和改进:


#### 功能上:

1. 集成 `Promise`, 我们不再需要多写一个 `componentDidMount` 方法去异步获取数据, 更多情况下, 我们将使用 `stateless component` 让代码更加简洁;
-  `Store` 的使用更加灵活, `Store` 的单实例和多实例使用能很巧妙地实现跨组件通信和通用组件控制逻辑的复用;

#### 相比 [flux](http://facebook.github.io/flux/docs/overview.html#content):

1. API 更加简洁, 在业务中一般只会用到 `connect` 和 `dispatch` 方法;
-  对状态进行集中管理, 写法与原始的 `React` 相似, 学习和迁移成本低;
-  更轻量, min 后只有 6K;

## 使用示例

> /components/Counter.js

```js
import React from 'react';
import {connect, dispatch, registerStore} from 'nearly-react';

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

registerStore('counter', {
    // 必须实现 init 方法, 它将被隐式调用, 作用是初始化 state
    init() {
        return {
            count: 0
        };
    },

   add(getState, step) {
       return {
           count: getState().count + step
       };
   }
};

export default connect('counter', Counter);
```

> /index.js

```js
import React from 'react';
import { render } from 'react-dom';
import Counter from './components/Counter';

render(
    <Counter />,
    document.getElementById('root')
)
```

## API

### registerStore(storeName, dispatcherSet)

该方法将注册一个 `Store`, 需要注意的是该方法必须先 `connect` 执行, 例:

```
registerStore('customStore', {
    // 必须实现 init 方法
    init() {
        return {sum: 0};
    },
    add(getState, num) {
        return {sum: getState().sum + num};
    }
});
```


### Dispatcher functions(getState, ...args)
`registerStore` 接受的第二个参数里的方法即 `Dispatcher functions`;
`Dispatcher function` 的第一个参数为 `getState` 方法, 该方法返回的永远是当前最新的 `state`, 其余参数为 `dispatch` 方法所传的参数;

对于 `Dispatcher function` 的返回值:

- 为普通对象时, 返回值直接 merge 进旧 state;
- 为 `Promise` 时, 取 `Promise.prototype.then` 方法里的参数 merge 进旧 state;
- 为 `null` 时, 不 merge, 不触发 render;

例:


```js
registerStore('counter', {
    // 必须实现 init 方法, init 中也可以使用 Promise
    init() {
        return fetch('./test.json').then(res => res.json());
    },
    
    add(getState, step) {
        return {
            count: getState().count + step
        };
    },
   
   // 异步增加
    addAsync(getState, step) {
        return new Promise(resolve => {        
            setTimeout(() => {
                // getState 方法返回的永远是最新的 state
                let count = getState().count + step;
                resolve({count})
            }, 1000);
        });
    },

    // 不触发渲染
    nothing(getState, step) {
        return null;
    }
};
```


### dispatch(action, ...args)
默认配置的 `action` 格式为 `${storeName}::${function}`, 

dispatch 会根据 `action` 映射到相应的 `Dispatcher function`, 并将 args 作为参数传入 `Dispatcher function`, 将其返回的结果提交给 `Store`, 由 `Store` 触发组件更新;

### connect(storeName, Component [, PlaceHolder])
该方法会根据 `storeName` 获得 `Store`, 再将 `Store`, `Component` 和 `PlaceHolder` 组合, 返回一个高阶组件;

其中, `PlaceHolder` 为默认展示组件 (可选), 当且仅当 `init` 返回 `Promise` 时有效, 在 `Component` 被插入 dom 之前, 组合后的高阶组件会先展示 `PlaceHolder` 组件, 可用于实现 loading 之类的效果;


## 进阶使用


### dispatcher(action, ...args)
即 `dispatch` 的高阶函数; 例:

```js
dispatch('counter::add', 1);
等同于: dispatcher('counter::add')(1);

dispatch('test::testAdd', 1, 2, 3, 4);
等同于: dispatcher('test::testAdd', 1, 2)(3, 4);
```


### configure(option)

使用 `nearly` 进行开发, 我们需要考虑 `storeName` 重复的情况, 我推荐通过将 `storeName` 映射文件路径的方式来避免;

`nearly` 提供了两个可供配置的方法: `beforeConnect` 和 `beforeDispatch`;

- `beforeConnect` 会在 `connect` 方法被调用之前调用, 接受的参数为传入 `connect` 方法的 `storeName`; 我们可以用它去加载对应的 JS 文件, 并注册 `Store`;
- `beforeDispatch` 会在 `dispatch` 方法被调用之前调用, 接受的参数为传入 `dispatch` 方法的 `action`;


默认配置如下:

```js
import {registerStore, getStore} from './store';

let config = {
    // 默认不开启自动注册 Store
    beforeConnect(storeName) {
        // let realName = storeName.split('#')[0];
        // return registerStore(storeName, require(`./${realName}.js`));
    },

    beforeDispatch(action) {
        let [storeName, dispatcherName] = action.split('::');

        let store = getStore(storeName);
        if (!store) {
            throw Error(`store '${storeName}' does not exist`);
        }

        let dispatcher = store.dispatchers[dispatcherName];
        if (!dispatcher) {
            throw Error(`the module does not export function ${dispatcherName}`);
        }

        return {store, dispatcher};        
    }
}
```

使用示例:

```js
import {configure, registerStore} from 'nearly-react';

export default configure({
    // 配置 beforeConnect 方法, 自动注册 Store
    // 自动去 actions 目录下加载 JS 模块, 并注册 Store
    beforeConnect(storeName) {
        let realName = storeName.split('#')[0];
        return registerStore(storeName, require(`./actions/${realName}.js`));
    }
});

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


