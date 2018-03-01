/**
 * @file 木偶组件, 将与 /actions/counter.js 组合
 */

import React from 'react';
import {connect, dispatch, dispatcher} from 'grax-react';

// 'counter.add' 经过 Parser 解析后会调用 /actions/counter.js 里的 add 方法
let incr = () => dispatch('counter.add', 1);
let decr = () => dispatch('counter.add', -1);

let incrAsync = () => dispatch('counter.addAsync', 1);
let decrAsync = () => dispatch('counter.addAsync', -1);

// 更推荐使用 stateless component, 除非需要生命周期方法
function Counter(props) {
  return (
    <div>
      <div className="well">{props.store.counter.count}</div>
      <div className="well">{props.store.test.x}</div>
      <div className="well">{props.store.test.x + props.store.counter.count}</div>
      <button className="btn btn-default" onClick={decr}>-</button>
      <button className="btn btn-default" onClick={incr}>+</button>

      <button className="btn btn-default" onClick={decrAsync}>async -</button>
      <button className="btn btn-default" onClick={incrAsync}>async +</button>
    </div>
  )
}

// 更推荐使用 stateless component, 除非需要生命周期方法
function Counter2(props) {
  return (
    <div>
      <div className="well">{props.store.test.x}</div>
      <button className="btn btn-default" onClick={dispatcher('test.add', 1)}>-</button>
      <button className="btn btn-default" onClick={dispatcher('test.add', -1)}>+</button>
    </div>
  )
}

// 'counter' 经过 Parser 解析后会得到 /actions/counter.js 的引用
// connect 方法将 Counter 组件与 /actions/counter.js 组合, 生成一个新的组件
export default connect(['counter', 'test'], Counter, false);
export let Counter22 = connect('test', Counter2, false);