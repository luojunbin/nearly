'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isThenable = isThenable;
exports.getComponentName = getComponentName;

// 判断是不是 promise 的对象, 弱判断;
function isThenable(obj) {
    return !!obj && typeof obj.then === 'function';
}

function getComponentName(Component) {
    return Component.name || Component.displayName || 'Component';
}