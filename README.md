# Nearly

一个简洁的数据流框架;

## 安装

```
npm install --save nearly
```

## 特点
Nearly 相比 [flux](http://facebook.github.io/flux/docs/overview.html#content), 如下特点:

1. 增加了 **Paser** 和 **ActionFunction** 两个结构;
- 对使用者屏蔽了 `Store` 的存在;
-  对 `state` 进行集中管理, 更像原始的 `React`;
-  API 更加简单, 在业务中一般只会用到 `connect` 和 `dispatch` 方法, 你甚至不需要了解 flux;
-  更轻量, min 后只有 5K;

![data-flow](https://github.com/luojunbin/nearly/blob/master/doc/data-flow-min.png?raw=true)

### Parser
传入的 `action` 通过 `Parser` 解析后, 会命中某个文件上的某个方法, 该方法即为 `Action Funciton`, 所在的文件即 `Action File`;

### Action File & Action Function

1. `Action File` 即普通的 js 文件, 该文件所 `export` 的方法即为 `Action Function`;
- `Action File`必须 `export` 一个 `getState` 方法,  该方法返回的对象将作为组件的初始状态;
- `Action Function` 返回的状态将传给组件的 `props`;
- `Action Function` 返回 `null` 时, 将不触发组件的 `render`;
- **Action Function 集成了对 Promise 的判断;** 你可以 return 一个 PlainObject, 也可以 return 一个 Promise/Deffered 对象, 再在 then 方法里 return 真正的 state;


## 示例
TodoMVC
Counter(下面的示例代码)
React-SPA-Template(基于 nearly 的SPA项目模板)

## 使用


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
 * @file Action File, 将与 /components/Counter.js 组合
 */

// 返回初始 state, 这个方法是必须的
export function getState() {
    return {
        count: 0
    };
}

// Action Function 接收的第一个参数为 prevState
// 其余参数是 dispatch 方法中传入的参数
export function add(prevState, step) {
    return {
        count: prevState.count + step
    };
}
```

> /components/Counter.js

```
/**
 * @file 木偶组件, 将与 /actions/counter.js 组合
 */

import {connect, dispatch} from 'nearly';

// 'counter::add' 经过 Parser 解析后会调用 /actions/counter.js 里的 add 方法
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

// 'counter' 经过 Parser 解析后会得到 /actions/counter.js 的引用
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

import {configure} from 'nearly';

// 可供配置的方法有 nrSplit, nrImport 和 nrTarget
// 这里只配置 nrImport, 其余两个使用默认配置
configure('parser', {
    // 根据获得的 modName 去指定路径下 require 相应模块
    nrImport(modName) {
        let realName = modName.split('#')[0];
        // 根据模块名, 去 actions 目录下引用相应模块
        return require(`./actions/${realName}.js`);
    }
}
```

## API

### dispatch(action: string, ...args)
dispatch 会根据 `action` 找到相应的方法, `args` 可以有多个, 并将 args 作为参数传入, 将方法返回的结果传给 render 方法;

### dispatcher(action: string, ...args)
即 `dispatch` 的高阶函数; 例:

```
dispatch('counter::add', 1);
等同于: dispatcher('counter::add')(1);

dispatch('test::testAdd', 1, 2, 3, 4);
等同于: dispatcher('test::testAdd', 1, 2)(3, 4);
```

### configure(type, option)
现阶段 `configure` 所支持的配置项只有 `parser`;
`parser` 中可供配置的方法有 `nrSplit`, `nrImport`, `nrTarget`;
其中,
`nrSplit` 用于将`action`分割为模块名和方法名;
`nrImport` 用于根据模块名去 `require` 相应的模块;
`nrTarget` 用于根据模块和方法名获得相应的方法;

默认配置及拓展点如下:

```
import {configure} from 'nearly`;

// 默认配置如下
configure('parser', {
    // 根据 :: 将字符串指令分割为 modName(模块名) 和 fnName(方法名);
    nrSplit(actionStr) {
        let [modName, fnName] = actionStr.split('::');
        return {modName, fnName};
    },

    // 根据获得的 modName 去指定路径下 require 相应模块;
    nrImport(modName) {
        // 拓展点: 这里的对 '#' 操作的作用下面会讲
        let realName = modName.split('#')[0];
        return require(`./actions/${realName}.js`);
    },
    
    // 根据来自 nrImport 的模块和来自 nrSplit 的方法名,
    // 命中某个文件中的某个方法;
    nrTarget(mod, functionName) {
        if (mod[functionName]) {
            return mod[functionName];
        }

        // 拓展点: 模块中没有这个方法时, 根据返回一个默认的方法;
        switch (functionName) {
            case 'testState':
                return (prevState, state) => state;
        }

        throw Error(`the module does not export function ${functionName}`);
    }
}
```

## connect(Component, ActionFileName)
connect 是个高阶组件, 作用是连接组件和 `Action File` 成为一个新的组件;

调用这个方法后会返回一个组件, 组件的 props.__action 为 `ActionFileName`, 后面再对这个方法详细描述;


### 不同组件使用同一 store
在业务中我们经常会碰到两个组件依赖同一个数据源, 但两个组件难以通过父级传递数据;

使用 Nearly 我们能很轻易地将两个不同的组件绑定相同的 `store`, 只要传入 `connect` 的 `ActionFileName` 是相同的即可;
例:

```js
// 应用场景: 在 UserList.js 中展示用户列表, 在 UserNum.js 中用户的数量, 而两个组件难以通过父级传递数据;

// UserList.js
function UserList(props) {
    return (
        <ul>
            {props.list.map((v) => {
                return <li key={v.id}>{v.name}</li>
            })}
        </ul>
    )
}
export default connect(UserList, 'users');


// UserNum.js
function UserNum(props) {
    return <div>{props.list.length}</div>
}
export default connect(UserNum, 'users');
```

### 同一组件使用不同 store
我们开发通用组件时会需要给同一组件绑定不同 `store` 以复用;  可以通过给 `ActionFileName` 加上 `#id` 来区分不同 `store`;

```js
// 应用场景: 如适用于不同场景的弹窗
// Dialog.js
export default function Dialog (props){
    return <div>{props.content}</div>
}


// SuccessDialog.js

import Dialog from 'Dialog.js';

let SuccessDialog = connect(Dialog, 'dialog#success');
// 关闭弹窗
// dispatch('dialog#success::close');



// FailDialog.js

import Dialog from 'Dialog.js';

let FailDialog = connect(Dialog, 'dialog#fail');
// 关闭弹窗
// dispatch('dialog#fail::close');
```


## Tips

1. 没有提供 `afterDispatch` 等方法, 如果确实需要, 可以通过生命周期方法实现;
2. 分类目录结构和特征目录结构 Nearly 都能适应, 取决于开发者对 Nearly 的配置;
3. 更推荐使用 stateless component, 除非需要生命周期方法;



