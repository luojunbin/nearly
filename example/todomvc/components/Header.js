
import React, {PropTypes} from 'react';

import {dispatch, connect, registerStore} from 'grax-react';

const ENTER_KEY = 13;

function submit(e) {
    if (e.keyCode === ENTER_KEY) {
        e.preventDefault();

        let value = e.target.value.trim();

        if (value) {
            dispatch('todos::add', value);
            dispatch('header::reset');
        }
    }
}

function change(e) {
    dispatch('header::setText', e.target.value);
}

function Header(props) {

    return (
        <header className="header">
            <h1>todos</h1>
            <input
                className="new-todo"
                placeholder="What needs to be done?"
                autoFocus="true"
                onKeyDown={submit}
                value={props.text}
                onChange={change}
                />
        </header>
    );
}

Header.propTypes = {
    text: PropTypes.string.isRequired
}

export default connect('header', Header);

