

import React from 'react';

import {dispatcher, dispatch} from 'grax-react';

import classNames from 'classnames';

const ENTER_KEY = 13;


export default class TodoItem extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'TodoItem';
    }

    blurHandle(uid) {
        return (e) => {
            this.refs.editInput && dispatch('todos::finishEdit', uid, e.target.value.trim());
        };
    }

    enterHandle(uid) {
        return (e) => {
            if (e.keyCode === ENTER_KEY) {

                e.preventDefault();

                let value = e.target.value.trim();

                if (value) {
                    dispatch('todos::finishEdit', uid, value);
                }
            }
        };
    }


    componentDidUpdate() {
        this.refs.editInput && this.refs.editInput.focus();
    }

    render() {

        let {isEditing, isCompleted, uid, text} = this.props;

        let ref = isEditing ? {ref: 'editInput'} : false;

        return (
            <li className={classNames({
                completed: isCompleted,
                editing: isEditing
            })}>
                <div className="view">
                    <input
                        className="toggle"
                        type="checkbox"
                        checked={isCompleted}
                        onChange={dispatcher('todos::toggle', uid)}
                    />
                    <label onDoubleClick={dispatcher('todos::edit', uid)}>{text}</label>
                    <button
                        className="destroy"
                        onClick={dispatcher('todos::del', uid)}
                    ></button>
                </div>
                <input
                    className="edit"
                    defaultValue={text}
                    onBlur={this.blurHandle(uid)}
                    onKeyDown={this.enterHandle(uid)}
                    {...ref}
                />
            </li>
        )

    }
}

