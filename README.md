# Grax

一个简洁, 强大的数据流框架;

## 安装

```
npm install --save grax-react
```

## 依赖

Grax 依赖 Promise, 对需要兼容旧版本浏览器的场景, 需要使用 [polyfill](https://github.com/stefanpenner/es6-promise);

## 特性

![data-flow](https://github.com/luojunbin/grax/blob/master/doc/flux-diagram-white-background.png)

上图为 [flux](http://facebook.github.io/flux/docs/overview.html#content) 架构图, Grax 参考自 [flux](http://facebook.github.io/flux/docs/overview.html#content), 在其基础上做了以下简化和改进:


#### 功能上:

- 我们不再需要在 `componentDidMount` 里去异步获取数据来渲染组件, 更多情况下, 我们将使用 `stateless component` 来使代码更加简洁;
- 我们可以通过返回一个 `Promise` 来表示一个异步的 Action, 更加简洁;

#### 相比 [flux](http://facebook.github.io/flux/docs/overview.html#content):

- API 更加简洁, 在业务中一般只会用到 `connect` 和 `dispatch` 方法;
- 对状态进行集中管理, 写法与原始的 `React` 相似, 学习和迁移成本低;
- 友好的服务器端渲染支持;
- 更轻量, 压缩后文件大小只有 6K;

## 使用示例

```js
import React from 'react';
import {render} from 'react-dom';
import {connect, dispatch, registerStore} from 'grax-react';

registerStore('vm', {
  // 必须实现 init 方法, 它将被隐式调用, 作用是初始化 state
  init() {
    return { value: '' };
  },

  change(getState, value) {
    return { value };
  }
};

let change = (val) => dispatch('vm.change', val);

function Input(props) {
  return <input value={props.store.vm.value} change={change} />
}

function Text(props) {
  return <p>{props.store.vm.value}</p>
}

let GInput = connect('vm', Input);
let GText = connect('vm', Text);

render(
  <div><GInput/><GText/></div>,
  document.getElementById('root')
)
```

## API

### registerStore(storeName, dispatcherFunctions)

该方法将注册一个 `Store`, 需要注意的是该方法必须先 `connect` 执行, 例:

```js
registerStore('customStore', {
  // 必须实现 init 方法
  init() {
    return {count: 0};
  },
  // Dispatcher function
  add(getState, num) {
    return {count: getState().count + num};
  }
});
```

### Dispatcher functions(getState, ...args)
`registerStore` 接受的第二个参数里的方法即 `Dispatcher functions`;
`Dispatcher function` 的第一个参数为 `getState` 方法, 该方法返回的永远是当前最新的 `state`, 其余参数为 `dispatch` 方法所传的参数;

对于 `Dispatcher function` 的返回值:

- 为普通对象时, 返回值直接 merge 进旧 state;
- 为 `Promise` 时, 取 `resolve` 的值 merge 进旧 state;
- 为 `null` 时, 不 merge, 不触发 render;

例:

```js
registerStore('counter', {
  // 必须实现 init 方法, init 中也可以使用 Promise
  init() {
    return fetch('./test.json').then(res => res.json());
  },

  // 同步增加
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
`action` 格式为 `${storeName}.${dispatcherName}`,

### connect(storeNames, Component[, PlaceHolder, isPure])

`connect` 是一个高阶组件, 其将 Component 包裹后返回一个全新的组件;

- `storeNames` 可以是字符串或字符串数组, 当一个组件需要绑定多个 store 时可传入一个字符串数组;
- `Component` 是需要被绑定 store 的组件, 绑定后, Component 的 props 会被注入 `storeNames` 和 `store` 属性, 详见文档的第一个例子;
- `PlaceHolder` 为默认展示组件 (可选), 默认值为 false, 当且仅当 `store` 的 `init` 返回 `Promise` 时有效, 在 `Component` 被插入 dom 之前, 会先展示 `PlaceHolder` 组件, 可用于实现 loading 之类的效果;
- `isPure` 是一个用于性能优化的配置, 默认值为 false, 当设置为 true 时, 父组件的 `render` 将不会触发该组件的 `render`, 只有该组件所`connect` 的 `store` 里的 `dispatch` 方法能触发该组件的 `render`, 我相信这比通过在 `shouldComponentUpdate` 里写 `shallowEqual` 要高效和精准得多;

### dispatcher(action, ...args)
即 `dispatch` 的高阶函数; 例:

```js
dispatch('counter.add', 1);
等同于: dispatcher('counter.add')(1);

dispatch('test.testAdd', 1, 2, 3, 4);
等同于: dispatcher('test.testAdd', 1, 2)(3, 4);
```

### configure(option)

`grax` 提供了以下可供配置的参数;

- `defaultPure`, 默认值为 false, 设置为 true 时所有 `connect` 方法的 `isPure` 参数都会默认为 true;
- `beforeConnect` 会在 `connect` 方法被调用之前调用, 接受的参数为传入 `connect` 方法的 `storeName`;
- `beforeDispatch` 会在 `dispatch` 方法被调用之前调用, 接受的参数为传入 `dispatch` 方法的 `action`;

注意 `configure` 必须在业务逻辑之前运行, 否则不生效;

例:

```js
import {configure} from 'grax-react';

configure({
  defaultPure: true,
  beforeConnect(storeNames) {},
  beforeDispatch(action) {}
});
```

## 服务器端渲染

先看一个简单的例子, 详情可参考示例 [Counter-ssr](https://github.com/luojunbin/grax-react/tree/master/example/counter-ssr);

```js
import React from 'react';
import {renderToString} from 'react-dom/server';
import {ContextProvider, prepare} from 'grax-react';
import Counter from './Components/Counter';

// ContextProvider 仅在服务器端渲染时需要
function ServerApp (props) {
  return (
    <ContextProvider state={props.state}>
      <Counter/>
    </ContextProvider>
  );
}

export function renderServerApp () {
  return prepare(['counter']).then(data => {
    // data === { counter: { count
: 0 } }
    return renderToString(<ServerApp state={data}/>);
  });
}
```

### prepare(storeNames)

- `storeNames` 可以是字符串或字符串数组, 即本次渲染所需的 `store`, `prepare` 会根据 `storeNames` 找到相应的 `store`, 并运行 `init` 方法, 所以 `storeNames` 必须先经过 `registerStore`;
- 该方法返回一个 `Promise`, 在后端, `Promise` 所 `resolve` 的对象需传进 `ContextProvider`, 前端则需要把该对象写入 `window.__GRAX_STATE__` 来同步前端端的数据;

## 示例

- [TodoMVC](https://github.com/luojunbin/grax-react/tree/master/example/todomvc)
- [Counter](https://github.com/luojunbin/grax-react/tree/master/example/counter)
- [Counter-ssr](https://github.com/luojunbin/grax-react/tree/master/example/counter-ssr)
- [Dialog](https://github.com/luojunbin/grax-react/tree/master/example/dialog)
- [MVVM](https://github.com/luojunbin/grax-react/tree/master/example/one-store)

## Tips

1. 推荐在 `beforeConnect` 中通过传入的 `storeName` 映射文件名, 动态 ``require` 来 `registerStore`, 这样在保证 `storeName` 唯一性的同时会更加直观和好维护;
2. 在 Grax 中对 `Promise` 的判断是不准确的 *(只要有 `then` 方法均认为是 `Promise` 实例)* , 一方面是因为 Grax 中只使用了 `then` 方法, 另一方面是为了兼容 `jQuery.Deferred` 等类库;
3. 欢迎提 issue 或是 pr;


