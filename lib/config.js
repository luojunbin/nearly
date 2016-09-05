'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.configure = configure;
var parser = exports.parser = {
    nrSplit: function nrSplit(str) {
        var _str$split = str.split('::');

        var _str$split2 = _slicedToArray(_str$split, 2);

        var modName = _str$split2[0];
        var fnName = _str$split2[1];


        return { modName: modName, fnName: fnName };
    },
    nrImport: function nrImport(modName) {
        var realName = modName.split('#')[0];

        return require('./' + realName + '.js');
    },
    nrGet: function nrGet(mod, functionName) {
        if (mod[functionName]) {
            return mod[functionName];
        }
        throw Error('the module does not export function ' + functionName);
    }
};

var config = exports.config = { parser: parser };

function configure(type, opt) {
    if (config[type] === undefined) {
        throw Error('configure does not supports ' + type);
    }

    for (var key in opt) {
        config[type].hasOwnProperty(key) && (config[type][key] = opt[key]);
    }
}