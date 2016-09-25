import {describe, it} from 'mocha';

import {expect} from 'chai';

import {configure, parser} from '../src/config';

let {nrSplit, nrImport, nrTarget} = parser;

describe('configure test', () => {
    it('parser configuration should be in effect', () => {
        
        configure('parser', {
            nrSplit() {
                return 1;
            }
        });

        expect(parser.nrSplit).to.not.equal(nrSplit);
        expect(parser.nrSplit()).to.equal(1);

        configure('parser', {
            nrSplit() {
                return 2;
            }
        });

        expect(parser.nrSplit()).to.equal(2);
    });
});



