import {isThenable} from './utils';


function isBrowser () {
  try {return this === window;} catch (e) {return false;}
}



export default class StoreModule {
  constructor (name, dispatchers, state) {
    this.name = name;

    this.state = state;
    this.isPending = false;
    this.renderHandlers = [];
    this.dispatchers = dispatchers;

    this.getState = this.getState.bind(this);
    this.dispatch = this.dispatch.bind(this);
    this.syncDispatch = this.syncDispatch.bind(this);
  }

  getState () {
    return {...this.state};
  }

  initState () {
    if (typeof this.dispatchers.init !== 'function') {
      throw Error(`can not find 'init' of store: ${this.name}`);
    }

    if (this.isPending) {
      return null;
    }

    let state = this.dispatchers.init(this.getState);

    if (isThenable(state)) {
      this.isPending = true;
      return state.then(state => {
        this.isPending = false;
        this.syncDispatch(state);
      });
    }

    return this.syncDispatch(state);
  }

  link (renderHandler) {
    this.renderHandlers.push(renderHandler);
  }

  unlink (renderHandler) {
    this.renderHandlers = this.renderHandlers.filter(v => v !== renderHandler);
  }

  dispatch (state) {
    return Promise.resolve(state).then(this.syncDispatch);
  }

  syncDispatch (state) {
    if (state !== null) {
      this.state = {...this.state, ...state};
      this.renderHandlers.forEach(renderHandler => renderHandler({[this.name]: this.getState()}));
    }

    return this.state;
  }
}
