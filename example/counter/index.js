/**
 * @file 应用入口
 */

import React from 'react';
import { render } from 'react-dom';
import './nearly-config';
import Counter from './components/Counter';

render(
    <Counter />,
    document.getElementById('root')
)