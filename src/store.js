import {isThenable} from './utils';

export default class StoreModule {
  constructor (storeName, dispatchers) {
    this.storeName = storeName;

    this.state = null;
    this.renders = [];
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
      throw Error(`can not find 'init' of ${this.storeName}`);
    }

    this.dispatch(this.dispatchers.init(this.getState));
  }

  link (render) {
    this.renders.push(render);
  }

  unlink (render) {
    this.renders = this.renders.filter(v => v !== render);
  }

  dispatch (state) {
    return isThenable(state)
      ? state.then(this.syncDispatch)
      : this.syncDispatch(state);
  }

  syncDispatch (state) {
    if (state !== null) {
      this.state = {...this.state, ...state};
      this.renders.forEach(render => render({[this.storeName]: this.state}));
    }

    return this.state;
  }
}
