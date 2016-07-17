


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
        count: preState.count - 1
   };
}

export function update(prevState, count) {
    return { count };
}
