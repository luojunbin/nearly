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

1. 以 JS 模块为单位创建 `Store`, 并对使用者屏蔽了 `Store` 的存在, 省略了手动创建 `Store` 的过程, ;
- 将 JS 模块 `export` 的方法默认注册为 `Dispatcher`, 省略了手动注册 `Dispatcher` 的过程, ;
- 在 `Dispatcher` 之上增加了 `Parser` 结构, 用于解析传入的具有约定结构的 `actions`, 使之映射到唯一的 `Store` 和 `Dispatcher`;

#### 功能上:

1. 集成 `Promise`, 你不再需要多写一个 `componentDidMount` 方法去异步获取数据, 对热衷于 `stateless component` 的人来说是个福音;
-  `Store` 的使用更加灵活, 支持同一 `Store` 的单实例使用和多实例使用;

#### 相比 [flux](http://facebook.github.io/flux/docs/overview.html#content):

1. API 更加简洁, 在业务中一般只会用到 `connect` 和 `dispatch` 方法;
-  对 `state` 进行集中管理, 写法与原始的 `React` 相似, 学习和迁移成本低;
-  更轻量, min 后只有 6K;

## 使用示例

> 目录结构

```js
/app
    /actions
        counter.js
    /components
        Counter.js
    index.js
    nearly-config.js
```

> /actions/counter.js

```
/**
 * @file Dispatcher File, 将与 /components/Counter.js 组合
 */

// 初始化 state, 这个方法将被隐式调用, required!
export function init() {
    return {
        count: 0
    };
}

// Dispatcher 方法接收的第一个参数为 getState 方法
// 其余参数是 dispatch 方法中传入的参数
export function add(getState, step) {
    return {
        count: getState().count + step
    };
}
```

> /components/Counter.js

```
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

// 'counter' 经过 Parser 解析后会得到 /actions/counter.js 模块
// connect 方法将 Counter 组件与 /actions/counter.js 组合, 生成一个新的组件
export default connect(Counter, 'counter');
```

> /index.js

```
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


> /nearly-config.js

```
/**
 * @file 配置 nearly
 */

import {configure} from 'nearly-react';

// 可供配置的方法有 nrSplit, nrImport 和 nrTarget
// 这里只配置 nrImport, 其余两个使用默认配置
configure('parser', {
    // 根据获得的 modName 去指定路径下 require 相应模块
    nrImport(modName) {
        let realName = modName.split('#')[0];
        // 根据模块名, 去 actions 目录下引用相应模块
        return require(`./actions/${realName}.js`);
    }
});
```

## API

### connect(storeName: string, Component, [PlaceHolder])
将 `Component` 和 `storeName` 组合, 返回一个新的组件; 其中 `storeName` 将被 `Parser` 的 `nrImport` 方法解析, 得到相应的 JS 模块; `PlaceHolder` 为默认展示组件, 在 `Component` 被插入 dom 之前会先展示 `PlaceHolder` 组件, 可用于 loading 之类的效果;

### dispatch(action: string, ...args)
dispatch 会根据 `action` 找到相应的方法, `args` 可以有多个, 并将 args 作为参数传入, 将方法返回的结果写入组件的 `props` 中;

### dispatcher(action: string, ...args)
即 `dispatch` 的高阶函数; 例:

```
dispatch('counter::add', 1);
等同于: dispatcher('counter::add')(1);

dispatch('test::testAdd', 1, 2, 3, 4);
等同于: dispatcher('test::testAdd', 1, 2)(3, 4);
```

### configure(type, option)
现阶段 `Nearly` 只支持对 `parser` 的配置, 通过合理的配置, 分类目录结构和特征目录结构 `Nearly` 都能适应;

`parser` 中可供配置的方法有 `nrSplit`, `nrImport`, `nrTarget`, 其中,

- `nrSplit` 将 `action` 分割为 `modName`(模块名) 和 `fnName`(方法名);
- `nrImport` 根据 `modName` 去 `require` 相应的模块;
- `nrTarget` 根据获得的模块和 `fnName` 获得相应的方法;


大体流程如下:

![data-flow](https://github.com/luojunbin/nearly/blob/master/doc/config-min.png)


默认配置及拓展点如下:

```
import {configure} from 'nearly`;

// 默认配置如下
configure('parser', {
    // 根据 :: 将 action 分割为 modName(模块名) 和 fnName(方法名); 
    nrSplit(action) {
        let [modName, fnName] = action.split('::');
        return {modName, fnName};
    },

    // 根据获得的 modName 去指定路径下 require 相应模块;
    nrImport(modName) {
        // '#' 的作用下面会讲
        let realName = modName.split('#')[0];
        return require(`./actions/${realName}.js`);
    },
    
    // 根据来自 nrImport 的模块和来自 nrSplit 的方法名,
    // 命中某个文件中的某个方法;
    nrTarget(mod, functionName) {
        if (mod[functionName]) {
            return mod[functionName];
        }

        // 默认的 Dispatcher;
        switch (functionName) {
            case 'testState':
                return (getState, state) => state;
        }

        throw Error(`the module does not export function ${functionName}`);
    }
}
```

## 进阶使用

### 在 Dispatcher 方法中使用 Promise
需要声明的是: 在 Nearly 中对 `Promise` 的判断是不完全的(只要有 `then` 方法均认为是 `Promise` 实例, This is a  feature!), 一方面是因为 Nearly 中只使用了 `then` 方法, 另一方面是为了兼容 `$.Deferred`;

以上面的 Counter 的例子做修改:

> /actions/counter.js 异步版本

```
/**
 * @file Dispatcher File, 将与 /components/Counter.js 组合
 */

// 初始化 state, 这个方法将被隐式调用, required!
export function init() {
    return fetch('./test.json').then(res => res.json());
}

// getState 方法返回的永远是最新的 state
export function add(getState, step) {
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                count: getState().count + step
            });
        }, 1000);
    });
}
```

### 同一 Store 单实例使用
在业务中我们经常会碰到两个组件依赖同一个数据源, 但两个组件难以通过父级传递数据;

使用 Nearly 我们能很轻易地将两个不同的组件绑定相同的 `store`, 只要传入 `connect` 的 `storeName` 是相同的即可;
例: 简单的数据输入同步

```js
// /actions/value.js
...

// Input.js
function Input(props) {
    return (
        <input className="form-control" value={props.value} onChange={change} />
    )
}
export default connect(Input, 'value');


// Text.js
function Text(props) {
    return (
        <h2>{props.value}</h2>
    )
}
export default connect(Text, 'value');
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
[TodoMVC](https://github.com/luojunbin/nearly/tree/master/example/todomvc)    
[Counter](https://github.com/luojunbin/nearly/tree/master/example/counter)    
[Dialog](https://github.com/luojunbin/nearly/tree/master/example/dialog)   
[One-store](https://github.com/luojunbin/nearly/tree/master/example/one-store)   
~~React-SPA-Template(基于 nearly 的SPA项目模板)~~





