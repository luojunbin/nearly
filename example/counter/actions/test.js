
// 返回初始 state, 这个方法是必须的
export function init() {
  console.log('init test');
    return {
        x: 0
    };
}

// Action Function 接收的第一个参数为 getState 方法
// 其余参数是 dispatch 方法中传入的参数
export function add(getState, step) {
    return {
        x: getState().x + step
    };
}

export function addAsync(getState, step) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                x: getState().x + step
            });
        }, 2000);
    });
}

