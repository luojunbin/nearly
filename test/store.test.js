import {describe, it} from 'mocha';
import {expect} from 'chai';

import {createStore, storeCache} from '../src/store';
import {configure, parser} from '../src/config';

let {nrSplit, nrImport, nrGet} = parser;




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

    it('store.state should equal to "getState()"', () => {

        const storeName = 'test_getState';

        const EXAMPLE_STATE = {
            test: 1
        };

        configure('parser', {
            nrImport() {
                return {
                    getState() {
                        return EXAMPLE_STATE;
                    }
                };
            }
        });

    });

    it('store.state should equal to "{}" if the module does not have "getState"', () => {

        const storeName = 'test_not_getState';

        configure('parser', {
            nrImport() {
                return {};
            }
        });

        let store = createStore(storeName);
        expect(store.state).to.deep.equal({});

    });

});





