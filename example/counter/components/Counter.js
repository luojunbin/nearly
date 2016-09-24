/**
 * @file 木偶组件, 将与 /actions/counter.js 组合
 */

import React from 'react';
import {connect, dispatch} from 'nearly';

// 'counter::add' 经过 Parser 解析后会调用 /actions/counter.js 里的 add 方法
let incr = () => dispatch('counter::add', 1);
let decr = () => dispatch('counter::add', -1);

// 更推荐使用 stateless component, 除非需要生命周期方法
function Counter(props) {
    return (
        <div>
            <div className="well">{props.count}</div>
            <button className="btn btn-default glyphicon glyphicon-minus" onClick={decr} />
            <button className="btn btn-default glyphicon glyphicon-plus" onClick={incr} />
        </div>
    )
}

// 'counter' 经过 Parser 解析后会得到 /actions/counter.js 的引用
// connect 方法将 Counter 组件与 /actions/counter.js 组合, 生成一个新的组件
export default connect(Counter, 'counter');