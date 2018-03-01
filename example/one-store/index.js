/**
 * @file 应用入口
 */

import React from 'react';
import { render } from 'react-dom';
import './grax-config';

import Input from './components/Input';
import Text from './components/Text';

import {connect} from 'grax-react';

let InputLeft = connect('value', Input);
let InputRight = connect('value', Input);
let TextCenter = connect('value', Text);

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