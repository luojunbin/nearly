

import React from 'react';

// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {dispatcher} from 'grax-react';

import TodoItem from './TodoItem';

export default function Main (props) {

    let {selectedList, completedNum, activeNum, editing} = props;

    let isChecked = activeNum === 0;

    return (
        <section className="main">
            <input
                className="toggle-all"
                type="checkbox"
                checked={isChecked}
                onChange={dispatcher('todos::toggleAll', !isChecked)}
            />
            <ul className="todo-list">
                {selectedList.map(v => <TodoItem {...v} key={v.uid} isEditing={editing === v.uid} />)}
            </ul>
        </section>
    )
}


