/**
 * @file 应用入口
 */

import React from 'react';
import { render } from 'react-dom';
import './nearly-config';

import Input from './components/Input';
import Text from './components/Text';

import {connect} from 'nearly';

let InputLeft = connect(Input, 'value');
let InputRight = connect(Input, 'value');
let TextCenter = connect(Text, 'value');

render(
    <div className="row">
        <div className="col-xs-6">
            <InputLeft />
        </div>
        <div className="col-xs-6">
            <InputRight />
        </div>
        <div className="col-xs-12">
            <TextCenter />
        </div>
    </div>
    ,
    document.getElementById('root')
)