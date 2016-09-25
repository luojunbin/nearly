import {describe, it} from 'mocha';
import {expect} from 'chai';

import {createStore, storeCache} from '../src/store';
import {configure, parser} from '../src/config';

let {nrSplit, nrImport, nrTarget} = parser;

describe('store subscribe unsubscribe test', () => {

    const store_name = 'test_store_cache';

    it('store cache', () => {
        configure('parser', {
            nrImport(modName) {
                let realName = modName.split('#')[0];

                return require(`./store.test.js`);
            }
        });

        expect(createStore(store_name)).to.equal(createStore(store_name));
    });

    const storeName = 'test_initState';

    const EXAMPLE_STATE = {
        test: 1
    };

    configure('parser', {
        nrImport() {
            return {
                initState() {
                    return EXAMPLE_STATE;
                }
            };
        }
    });

    it('store.getState() should not equal to "initState()"', () => {
        expect(createStore(store_name).getState()).to.not.equal(EXAMPLE_STATE);
    });

    it('store.getState() should deep equal to "initState()"', () => {
        expect(createStore(store_name).getState()).to.deep.equal(EXAMPLE_STATE);
    });

    it('store.getState() should not equal to store.getState()', () => {
        expect(createStore(store_name).getState()).to.deep.equal(createStore(store_name).getState());
    });

});





