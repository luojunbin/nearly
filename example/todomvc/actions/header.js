
export function initState() {
    return {
        text: ''
    };
}

export function reset() {
    return {
        text: ''
    };
}

export function setText(getState, text) {
    return {text};
}

