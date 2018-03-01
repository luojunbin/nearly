/**
 * @file Action File, 将与 /components/Counter.js 组合
 */

// 返回初始 state, 这个方法是必须的
export function init () {
  console.log('init counter');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({count: Math.random()})
    }, 2000);
  });
}

// Action Function 接收的第一个参数为 getState 方法
// 其余参数是 dispatch 方法中传入的参数
export function add (getState, step) {
  return {
    count: getState().count + step
  };
}

export function addAsync (getState, step) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        count: getState().count + step
      });
    }, 2000);
  });
}