/**
 * @file 应用入口
 */

import React from 'react';
import { render } from 'react-dom';
import './nearly-config';
import Counter from './components/Counter';
import {Counter22} from './components/Counter';

render(
  <div>
    <Counter />
    <Counter22 />
  </div>,
    document.getElementById('root')
)