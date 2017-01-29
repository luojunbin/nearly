/**
 * @file 木偶组件, 将与 /actions/counter.js 组合
 */

import React from 'react';
import {dispatcher} from 'nearly-react';

export default function Dialog(props) {

    let className = props.isHide ? 'modal-dialog glb-hide' : 'modal-dialog';

    return (
        <div className={className}>
            <div className="modal-content">
                <div className="modal-header">
                    <button
                        type="button"
                        className="close"
                        onClick={dispatcher(`${props._storeName}::dismiss`)}>
                        <span>&times;</span>
                        <span className="sr-only">Close</span>
                    </button>
                    <h4 className="modal-title">{props.title}</h4>
                </div>
                <div className="modal-body">...</div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-default"
                        onClick={dispatcher(`${props._storeName}::dismiss`)}
                        >Close</button>
                    <button type="button" className="btn btn-primary">Save changes</button>
                </div>
            </div>
        </div>
    );
}