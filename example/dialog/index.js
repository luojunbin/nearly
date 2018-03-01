/**
 * @file 应用入口
 */

import React from 'react';
import { render } from 'react-dom';
import './grax-config';

import {connect, dispatcher} from 'grax-react';

import Dialog from './components/Dialog';

let FailDialog = connect('dialog#fail', Dialog);
let SuccessDialog = connect('dialog#success', Dialog);

let showFailDialog = dispatcher('dialog#fail::show');
let showSuccessDialog = dispatcher('dialog#success::show');

render(
    <div>
        <button className="btn btn-primary btn-lg" onClick={showFailDialog}>
            Launch Fail Dialog
        </button>
        &nbsp;
        <button className="btn btn-primary btn-lg" onClick={showSuccessDialog}>
            Launch Success Dialog
        </button>
        <FailDialog title="FailDialog" />
        <SuccessDialog title="SuccessDialog" />
    </div>
    ,
    document.getElementById('root')
)