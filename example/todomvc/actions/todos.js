
import {createId, getHash} from '../utils/';

const ITEM_MODEL = {
    uid: 0,
    isCompleted: false,
    text: 'defualt text'
};

export function getState() {

    return {
        editing: -1,
        filter: getHash(),
        list: JSON.parse(localStorage.getItem('todo-data')) || []
    };
}

export function add(prevState, text) {

    let uid = createId();

    let list = prevState.list.concat([{...ITEM_MODEL, text, uid}]);

    return {list};
}

export function del(prevState, uid) {
    let list = prevState.list.filter(v => v.uid !== uid);

    return {list};
}

export function toggle(prevState, uid) {

    let list = prevState.list.map(v => {
        if (v.uid === uid) {
            let isCompleted = !v.isCompleted;

            return {...v, uid, isCompleted};
        }

        return v;
    }); 

    return {list};
}

export function toggleAll(prevState, isCompleted) {

    let list = prevState.list.map(v => {
        return {...v, isCompleted}
    });

    return {list};
}

export function edit(prevState, uid) {
    return {
        editing: uid
    };
}

export function finishEdit(prevState, uid, text) {
    let list = prevState.list.map(v => {
        return v.uid === uid
            ? {...v, text}
            : v;
    });

    return {
        list,
        editing: -1
    };
}

export function changeFilter(prevState, filter) {
    return {filter};
}

export function clearCompleted(prevState) {

    let list = prevState.list.filter(v => !v.isCompleted);

    return {list};
}




