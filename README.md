# Nearly 文档

## 前言
Nearly 是一个轻量, 高效, 简洁的数据流框架; 其核心思想来自 [flux](http://facebook.github.io/flux/docs/overview.html#content) 和 [redux](https://github.com/reactjs/redux)

我认为redux 是一个很强大的数据流, 但 react-redux 的写法太过于繁琐, 如:

1. 我个人不喜欢`switch-case-default-return`这样的写法, 但我却没有更好的写法;
-  每增加一个 type 就得在 actionTypes.js 中增加一个相应的常量, 再在 actions.js 中增加 dispatch 这个 type 的方法, 再在 reducer.js 中增加该 type 的 switch-case;
-  actions.js 里面的方法, 方法名多数和 type 是一样, 其作用往往只是传参给 reducer;
-  state 的各个属性在各个 reducer 中分散管理, 我认为这只适合在较复杂的场景下使用, ;

**所以, 在复杂的业务场景下才能体现出 redux 的优势, 但在中小型应用中使用 redux 并不是一个好的选择;**

Nearly 作为一个更简洁的数据流, 其结构图如下:


![data-flow](https://github.com/luojunbin/nearly/blob/master/doc/data-flow.png?raw=true)


相比 `redux`, `Nearly` 有以下特点:

1. 通过指定 `Action` 的格式, 在传入 `Dispatcher` 时, 用 `Parser` 解析, 将其映射到某个文件中的 `ActionFunction`, `ActionFunction` 将执行的结果传给 `Store`;
-  将 `Dispatcher` 从 `Store` 中分离, 并对使用者屏蔽了 `Store` 的存在;
-  对 State 进行集中管理;
-  API 更加简单, 在业务中一般只会用到 `connect` 和 `dispatch` 方法, 你甚至不需要了解 flux 就能使用;
-  更轻量, min 后只有5K;


## 安装

```
npm i nearly --save
```

## 使用

> 目录结构

```js
/app
    /components
        Counter.js
    /actions
        counter.js
    index.js
    nearly-config.js
```

> /index.js

```
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
import {configure} from 'nearly`;

// 默认配置也是这样
configure('parser', {
    // 根据 :: 将字符串指令分割为 modName(模块名) 和 fnName(方法名);
    nrSplit(actionStr) {
        let [modName, fnName] = actionStr.split('::');
        return {modName, fnName};
    },

    // 根据获得的 modName 来 require 相应模块;
    nrImport(modName) {
        let realName = modName.split('#')[0];
        return require(`./actions/${realName}.js`);
    }
}
```

> /actions/counter.js

```
// 根据 Parser 里的配置

// 返回初始 state
export function getState() {
    return {
        count: 0
    };
}

// 加 action
export function add(prevState, num) {
    return {
        count: prevState.count + num
    };
}
```

> /components/Counter.js

```
import {connect, dispatcher} from 'nearly';

// 这里的 actionStr 为 'counter::add';
// 经过 Parser 解析后会调用 /actions/counter.js 里的 add 方法;
let incr = () => dispatch('counter::add', 1);
let decr = () => dispatch('counter::add', -1);

// 更推荐使用 stateless component, 除非需要生命周期方法
function Counter(props) {
    return (
        <div>
            <a href="#" onClick={incr}> - </a>
            <span>{props.count}</span>
            <a href="#" onClick={decr}> + </a>
        </div>    
    )
}
// 这里用 connect 生成了一个连接了 /actions/counter.js 的组件;
export default connect(Counter, 'counter');
```



## Dispatcher
`Dispatcher` 由 `Parser` 和 `ActionFunction` 组成; 

### dispatch(ActionStr, args)
dispatch 会根据 ActionStr 找到相应的方法, 并将 args 作为参数传入, 将方法返回的结果传给 render 方法;

### dispatcher
即 `dispatch` 的高阶函数; 例:

```
dispatch('counter::add', 1);
等同于: dispatcher('counter::add')(1);
```

## Parser
`Parser` 的作用是: 根据一个字符串, 解析出应该 `import` 的 JS 文件, 以及这个文件中应该被调用的方法;
`Parser` 包括两个方法: 
> `nrSplit`: 从字符串中获得模块名与方法名;
> `nrImport`: 使用模块名 import 该模块;

对于更繁杂的目录结构和业务场景, 可通过修改这两个方法的规则来实现, 配置时要注意: 规则可以复杂, 要让传入的 actionStr 尽量简单; 配置 API 如下;

### configure(type, option)
现阶段 `configure` 所支持的配置项只有 `parser`, 
使用及默认配置如下:

```
import {configure} from 'nearly`;

configure('parser', {
    // 根据 :: 将字符串指令分割为 modName(模块名) 和 fnName(方法名);
    nrSplit(actionStr) {
        let [modName, fnName] = actionStr.split('::');
        return {modName, fnName};
    },

    // 根据获得的 modName 来 require 相应模块;
    nrImport(modName) {
        let realName = modName.split('#')[0];
        return require(`./actions/${realName}.js`);
    }
}
```

所以, 对于 `dispatch('counter::increment')`, 执行步骤如下:

1. 执行 `nrSplit('counter::increment')` 得到 `{ modName: 'counter', fnName: 'increment' }`;
2. 将得到的 `modName` 作为 key 生成 store 并缓存;(这一步对使用者来说是透明的, 说明是为了方便下文解释`nrImport`方法中对`#`号的处理);
3. 再将得到的 `modName` 传入 `nrImport` 方法, 进而获得模块的引用;
4. 获得的模块后, 根据 `fnName` 调用相应的 `ActionFunction`, 获得一个 `state`;
5. 将得到的 `state` 传给相应的 `store`, 由 `store` 触发组件渲染;




## Action File & Action Function

Action File 和普通的 JS 并没有区别, 可以理解为一个普通 的 React 组件的 render 方法被放进了 /components 目录下, 而其余的数据操作被放进了 /actions 目录下的 Action File 里;

### getState()
等同于 `React.Component.getInitState`; 返回一个作为初始的 state 的对象;
(注: 每个 Action Fils 中都需要 `export` 这个方法, 如果没有, 则初始 state 默认为 `{}`)

### Action Function (prevState, args)
1. Action Function 必须被 `export`;
-  Action Function 接收的第一个参数为之前的 State, 其他参数可以是从 dispatch 中传入的参数;
-  **Action Function 集成了对 Promise 的判断;** 你可以 return 一个 PlainObject, 也可以 return 一个 Promise 对象, 再在 then 方法里 return 真正的 state;
(**注:** 这里是弱判断, 只要返回的对象里有 then 方法就行, 所以也可以用 jQuery 的 Deffered 代替 Promise);
-  **如果直接返回 `prevState` 会报错, 如果希望`dispatch`不触发`render`, 请返回`null`;**

示例如下: 
> path: /actions/counter.js

```js

// 获得初始 state
export function getState() {
    return {
        count: 0
    };
}

// 加一 action
export function increment(prevState) {
    return {
        count: prevState.count + 1
    };
}

// 减一 action
export function decrement(prevState) {
    return {
        count: prevState.count - 1
   };
}

// 直接更新 action
export function update(prevState, count) {
    return { count };
}

```

## connect(component, actionFile)
connect 是个高阶组件, 作用是连接组件和 action 成为一个新的组件;
参数 Component 是组件;
参数 actionFile 是一个字符串;

调用这个方法后, 
调用这个方法后会返回一个组件, 组件的 props.__action 为 actionPath, 后面再对这个方法详细描述;


### 不同组件使用同一 store
在业务中我们经常会碰到两个组件依赖同一个数据, 但两个组件结构上无法直接传递方法; (比如说在组件A中展示用户列表, 但在组件B中展示B的业务逻辑外还要展示A的用户的数量);
如果使用 redux 我们只需对两个组件使用同一个 reducer 即可;
如果使用 Nearly 我们能很轻易地将两个不同的组件绑定相同的 store, 只要传入 connect 的 actionFile 是相同的即可;

```js

// UserList.js
function UserList(props) {
    return (
        <ul>
            {props.list.map((v) => {
                return <li>{v.id} | {v.name}</li>
            })}
        </ul>
    )
}

export default connect(UserList, 'userlist');


// UserNum.js
function UserNum(props) {
    return <div>{props.list.length}</div>
}

export default connect(UserNum, 'userlist');
```

### 同一组件使用不同 store
我们开发通用组件时会需要给同一组件绑定不同 store 以复用(如适用于不同场景的弹窗); 如果用 redux 则需要在 reducer中处理来自参数里的 id, 在 Nearly 的处理方式则更简单; 

```js

// Dialog.js
function Dialog (props){
    // ...
}

export default Dialog;



// successDialog.js

import Dialog from 'Dialog.js';

let SuccessDialog = connect(Dialog, 'dialog#success');
// 关闭弹窗
// dispatch('dialog#success::close');



// failDialog.js

import Dialog from 'Dialog.js';

let FailDialog = connect(Dialog, 'dialog#fail');
// 关闭弹窗
// dispatch('dialog#fail::close');
```


## Tips

1. 没有 afterDispatch 方法, 如果确实需要, 可以通过生命周期方法实现;
2. 分类目录结构和特征目录结构Nearly都能适应, 取决于开发者制定的规则;
3. 更推荐使用 stateless component, 除非需要生命周期方法;
4. 在 example/todomvc 中只使用了 actions 和 components 目录, 但对于更复杂的数据操作, 应该有个 models目录, 毕竟现在更推荐 [SAM](http://sam.js.org/) 模式;
5. 使用Nearly时配置 Hot Replacement 十分简单, 请参考 example/todomvc;


