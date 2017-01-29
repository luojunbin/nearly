
import {createId, getHash} from '../utils/';

const ITEM_MODEL = {
    uid: 0,
    isCompleted: false,
    text: 'defualt text'
};

export function init() {

    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            resolve({
                editing: -1,
                filter: getHash(),
                list: JSON.parse(localStorage.getItem('todo-data')) || []
            });
        }, 2000);
    });
}

export function add(getState, text) {

    let uid = createId();

    let list = [...getState().list, {...ITEM_MODEL, text, uid}];

    return {list};
}

export function del(getState, uid) {
    let list = getState().list.filter(v => v.uid !== uid);

    return {list};
}

export function toggle(getState, uid) {

    let list = getState().list.map(v => {
        if (v.uid === uid) {
            let isCompleted = !v.isCompleted;

            return {...v, uid, isCompleted};
        }

        return v;
    }); 

    return {list};
}

export function toggleAll(getState, isCompleted) {

    let list = getState().list.map(v => {
        return {...v, isCompleted}
    });

    return {list};
}

export function edit(getState, uid) {
    return {
        editing: uid
    };
}

export function finishEdit(getState, uid, text) {
    let list = getState().list.map(v => {
        return v.uid === uid
            ? {...v, text}
            : v;
    });

    return {
        list,
        editing: -1
    };
}

export function changeFilter(getState, filter) {
    return {filter};
}

export function clearCompleted(getState) {

    let list = getState().list.filter(v => !v.isCompleted);

    return {list};
}




