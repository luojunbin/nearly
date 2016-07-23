# Nearly 文档

## 前言
Nearly 是一个轻量, 高效, 简洁的数据流框架; 其核心思想来自 flux 和 redux;
在对 redux 进行实践和思考后, 我认为 redux 是一个很强大的数据流, 但 react-redux 的写法太过于繁琐, 如:

* 我不想这么写, 然而没有更好写法的`switch-case-default-return`组合;
* 每增加一个 type 就得在 actionTypes.js 中增加一个相应的常量, 再在 actions.js 中增加 dispatch 这个 type 的方法, 再在 reducer.js 中增加该 type 的 switch-case;
* actions.js 里面的方法, 方法名多数和 type 是一样, 其作用往往只是传参给 reducer;
* state 的各个属性在各个 reducer 中分散管理, 我认为这只适合大型应用;

在大型复杂应用可能体现出 redux 的优势, 但在中小型应用中使用 redux 并不是一个好的选择;

而 Nearly 作为一个更简洁的数据流具有以下特点:

1. 通过使用与action文件相关联的命令来替代 redux 中的 type;
2. 将 dispatch 操作从 store 中分离, 并对使用者屏蔽了 store 的存在;
3. props 集中管理, dispatch 传参给 action, action 返回的状态直接用于 render;
4. 更轻量, min 后只有5K;


## 安装

```
npm i nearly --save
```

## 使用

```js
import {connect, dispatch, dispatcher} from 'nearly';
```

## Action API

### getState()
关键字方法, 每个 action.js 中都要有个这样的方法;
这里 return 一个对象, 将作为初始的 state;

### director functions (prevState, args)
1. 指令方法接收的第一个参数为之前的 State, 其他参数可以是从 dispatch 中传入的参数;
2. director function 集成了对 Promise 的判断, 你可以 return 一个 PlainObject, 也可以 return 一个 Promise 对象(这里是弱判断, 只要返回的对象里有 then 方法就行, 比如 jQuery 的 Deffered);
3. 如果直接返回 prevState 会报错, 如果希望`dispatch`不触发render, 请返回`null`;

示例如下: 
> path: /actions/counter.js

```js

// 获得初始 state
export function getState() {
    return {
        count: 0
    };
}

// 加一指令
export function increment(prevState) {
    return {
        count: prevState.count + 1
    };
}

// 减一指令
export function decrement(prevState) {
    return {
        count: prevState.count - 1
   };
}

// 直接更新指令
export function update(prevState, count) {
    return { count };
}

```

## dispatch API

### dispatch(directorStr, args)
dispatch 会根据 directorStr 找到相应的方法, 并将 args 作为参数传入, 将方法返回的结果传给 render 方法;

### dispatcher
dispatcher(directorStr, ...args) 即 dispatch.bind(null, directorStr, ...args);
个人不习惯用箭头方法, 所以写个 dispatcher 方法;

### connect(component, actionPath)
connect 是个高阶组件, 接收的第一个参数是个组件, 第二个参数是 action 文件所在的地址的规则描述;
调用这个方法后会返回一个组件, 组件的 props.__action 为 actionPath, 后面再对这个方法详细描述;

示例如下:
path: /components/Counter.js

```js
import {connect, dispatcher} from 'nearly';

// 事件方法能缓存的尽量缓存;
// 当使用 stateless component 时就不再需要 this 了;
// 这里 dispatch 中的 'counter' 指的是 counter.js 文件, increment 指的是 counter.js 所 export 的方法;
let incr = dispatcher('counter::increment');
let decr = dispatcher('counter::decrement');


// 更推荐使用 stateless component, 除非需要生命周期方法
function Counter(props) {

    let btns = [];

    for (let i = 0; i < 10; ++i) {
        btns.push(
            <a href="javascript:;"
               onClick={dispatcher('counter::update', i)}>
               {i}
            </a>
        )
    }

    return (
        <div>
            <p>{props.count}</p>
            <a href="javascript:;" onClick={incr}>-</a>
            {btns}
            <a href="javascript:;" onClick={decr}>+</a>
        </div>    
    )

}

// 这里的 'counter' 即 dispatcher 中所用到的指令的命名空间;
// 同时也是 /actions/counter.js 的文件名;
// 通过下面 configure 方法的配置,
// 我们可以从'counter'这个字符串找到 '/actions/counter.js'并 import 进来;
export default connect(Counter, 'counter');

```

### configure(option)
现阶段`configure`所配置的内容只有一个目的: 根据一个字符串指令去调用相应的 JS 文件中的某个方法; 目前可配置的方法有`nrSplit`和`getMod`, 其中`nrSplit`返回的`modName`会传给`getMod`, 由`getMod`去 `require` 相应的模块;
对于更繁杂的目录结构可通过修改这两个方法的规则来实现, 配置的规则应当尽量简单;

#### nrSplit
> 根据`::`将字符串指令分割为`modName`(模块名)和`fnName`(方法名);

```js
//  默认配置如下:
function nrSplit(str) {
    let [modName, fnName] = str.split('::');

    return {modName, fnName};
}
```

#### getMod
> 根据前面获得的`modName`来 require 相应模块;

```js
//  默认配置如下:
function getMod(modName) {
    let realName = modName.split('#')[0];
    // babel 的 import 不能在 function 中, 用 require 代替
    return require(`./actions/${realName}.js`);
}
```

所以, 对于的`/components/Counter.js` 中的`dispatch('counter::increment')`指令的执行步骤如下:

1. 执行`nrSplit('counter::increment')`得到`{ modName: 'counter', fnName: 'increment' }`
2. 将得到的`modName`作为 key 生成 store 并缓存;(这一步对使用者来说是透明的, 说明是为了方便下文解释`getMod`方法中对`#`号的处理)
3. 再将得到的`modName`传入`getMod`方法, 进而获得到模块的引用;
4. 根据`nrSplit`中得到的`fnName`和`getMod`获得的模块调用相应的方法, 得到返回值`state`;
5. 将 `prevState` 和返回的 `state` 进行 merge 返回新的 `state`;
6. 将得到的 state 作为 props 传入组件, 触发render;

## connect 高阶组件的使用

### 不同组件使用同一 store
在业务中我们经常会碰到两个组件依赖同一个数据, 但两个组件却离得比较远, 我们无法将这两个组件放在一起; (比如说在组件A中展示用户列表, 但在组件B中展示B的业务逻辑外还要展示A的用户的数量);
如果使用 redux 我们只需将两个组件绑定同一个 reducer 就行了;
如果使用 Nearly 我们能很轻易地将两个不同的组件绑定相同的 store, 只要传入的actionPath是相同的即可;

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

// dispatch('dialog#success::close');

// failDialog.js

import Dialog from 'Dialog.js';

let FailDialog = connect(Dialog, 'dialog#fail');

// dispatch('dialog#fail::close');

```


## Tips

1. 没有 beforeDispatch 和 afterDispatch 方法, 如果确实需要, 通过生命周期方法实现;
2. 分类目录结构和特征目录结构Nearly都能适应, 取决于开发者制定的规则;
3. 更推荐使用 stateless component, 除非需要生命周期方法;
4. 在 example/todomvc 中只使用了 actions 和 components 目录, 但对于更复杂的数据操作, 应该有个 models目录, 毕竟现在更推荐 SAM 模式;
5. 使用Nearly时配置 Hot Replacement 十分简单, 请参考 example/todomvc;
6. 欢迎 PR~~





getState 不接受传参? 一般能通过直接传参给 props 实现

