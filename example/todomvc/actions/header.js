
export function getInitialState() {
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

