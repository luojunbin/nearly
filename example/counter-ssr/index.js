/**
 * @file 应用入口
 */

import React from 'react';
import {render} from 'react-dom';
import {renderToString} from 'react-dom/server';
import {ContextProvider, prepare} from 'grax-react';
import Counter from './Components/Counter';

const IS_BROWSER = new Function(`
  try {
    return this === window;
  } catch (e) {
    return false;
  }
`)();

function ServerApp (props) {
  return (
    <ContextProvider state={props.state}>
      <Counter/>
    </ContextProvider>
  );
}

export function renderClientApp () {
  render(<Counter/>, document.getElementById('root'));
}

export function renderServerApp () {
  return new Promise(resolve => {
    prepare(['counter']).then(data => {
      resolve({data, html: renderToString(<ServerApp state={data}/>)});
    });
  });
}

if (IS_BROWSER) {
  renderClientApp();
}

