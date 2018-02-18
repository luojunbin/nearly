
// 判断是不是 promise 的对象, 弱判断;
export function isThenable(obj) {
    return !!obj && (typeof obj.then === 'function');
}

export function getComponentName(Component) {
    return Component.name || Component.displayName || 'Component';
}
