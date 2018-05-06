/**
 * @file 应用入口
 */

import React from 'react';
import {render} from 'react-dom';
import Counter from './Components/Counter';

render(
  <Counter/>,
  document.getElementById('root')
);
