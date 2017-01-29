/**
 * @file Action File, 将与 /components/Counter.js 组合
 */

// 返回初始 state, 这个方法是必须的
export function init() {
    return {
        isHide: true,
        title: ''
    };
}

export function show(getState) {
    return {
        isHide: false
    };
}

export function dismiss(getState) {
    return {
        isHide: true
    };
}