/**
 * @file Action File, 将与 /components/Counter.js 组合
 */

// 返回初始 state, 这个方法是必须的
export function initState() {
    return {
        vlaue: ''
    };
}

export function onChange(getState, value) {
    return {value};
}