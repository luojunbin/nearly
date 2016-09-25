import React from 'react';
import {dispatch} from 'nearly';

function change(e) {
    dispatch('value::onChange', e.target.value);
}

export default function Input(props) {
    return (
        <div>
            <input className="form-control" value={props.value} onChange={change} />
        </div>
    )
}

