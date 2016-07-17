

export let createId = (function () {

    const UID_BASE = Math.floor(Math.random() * 19930506);

    return () => UID_BASE + Math.random().toFixed(8);
})();

export function getHash(hash) {
    return (hash || location.hash).slice(2).toUpperCase();
}
