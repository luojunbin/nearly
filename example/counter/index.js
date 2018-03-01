/**
 * @file 应用入口
 */

import React from 'react';
import {render} from 'react-dom';
import {renderToString} from 'react-dom/server';
import './grax-config';
import {resetStore} from 'grax-react';
import Counter, {Counter22} from './Components/Counter';

let a = (
  [
    <Counter22 key={1}/>,
    <Counter key={11}/>,
    <p key={3}>111</p>
  ]
);

render(
  a,
  document.getElementById('root')
);
