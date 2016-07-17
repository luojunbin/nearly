import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';

import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';
import './style/app.css';

import 'todomvc-common/base';

import './nearly-config';
    
import TodoApp from './containers/TodoApp';

// 热替换选项
if (module.hot) {
    module.hot.accept();
}

render(
    <TodoApp />,
    document.getElementById('root')
)
