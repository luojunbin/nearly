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