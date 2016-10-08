import {describe, it} from 'mocha';
import {expect} from 'chai';

import {createStore, storeCache} from '../src/store';
import {configure, parser} from '../src/config';


describe('store state cache and getState() test', () => {


    it('store cache', () => {
        const store_name = 'test_store_cache';

        configure('parser', {
            nrImport(modName) {
                let realName = modName.split('#')[0];

                return {
                    initState() {
                        return {};
                    }
                };
            }
        });

        expect(createStore(store_name)).to.equal(createStore(store_name));
    });

    const storeName = 'test_initState';

    const EXAMPLE_STATE = {
        test: 1
    };

    it('store.getState() should not equal to "initState()"', () => {
        configure('parser', {
            nrImport() {
                return {
                    initState() {
                        return EXAMPLE_STATE;
                    }
                };
            }
        });
        expect(createStore(storeName).getState()).to.not.equal(EXAMPLE_STATE);
    });

    it('store.getState() should deep equal to "initState()"', () => {
        configure('parser', {
            nrImport() {
                return {
                    initState() {
                        return EXAMPLE_STATE;
                    }
                };
            }
        });
        expect(createStore(storeName).getState()).to.deep.equal(EXAMPLE_STATE);
    });

    it('store.getState() should not equal to store.getState()', () => {
        configure('parser', {
            nrImport() {
                return {
                    initState() {
                        return EXAMPLE_STATE;
                    }
                };
            }
        });
        expect(createStore(storeName).getState()).to.deep.equal(createStore(storeName).getState());
    });
});


describe('store subscribe unsubscribe test', () => {

    configure('parser', {
        nrImport() {
            return {
                initState() {
                    return {};
                }
            };
        }
    });

    const storeName = 'test_subscribe';

    let store = createStore(storeName)
    let fakeComponent = {};

    it('store.subscribe() should push a component in array"', () => {

        console.log(store.components.includes(fakeComponent))

        expect(store.components.includes(fakeComponent)).to.be.false;
        store.subscribe(fakeComponent)
        expect(store.components.includes(fakeComponent)).to.be.true;
    });

    it('store.unsubscribe() should pop a component from array"', () => {
        store.unsubscribe(fakeComponent)
        expect(store.components.includes(fakeComponent)).to.be.false;
    });    

});

describe('store dispatch test', () => {

    configure('parser', {
        nrImport() {
            return {
                initState() {
                    return {
                        a: 1,
                        b: 2
                    };
                }
            };
        }
    });

    const storeName = 'test_dispatch';
    const isSetState = false;

    let store = createStore(storeName)
    let fakeComponent = {
        state: {},
        setState(state) {
            this.state = state;
        }
    };

    it('store.dispatch() should merge a state into the previous state and return it; component will be setState;"', () => {
        store.subscribe(fakeComponent)
        expect(store.dispatch({
            a: 2,
            c: 3
        })).to.deep.equal({
            a: 2,
            b: 2,
            c: 3
        });

        expect(fakeComponent.state).to.deep.equal({
            a: 2,
            b: 2,
            c: 3
        });
    });



});