
export function getState() {
    return {
        text: ''
    };
}

export function reset() {
    return {
        text: ''
    };
}

export function setText(prevState, text) {
    return {text};
}

