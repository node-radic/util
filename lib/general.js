"use strict";
var lodash_1 = require("lodash");
exports.round = function round(value, places) {
    var multiplier = Math.pow(10, places);
    return (Math.round(value * multiplier) / multiplier);
};
exports.makeString = function makeString(object) {
    if (object == null)
        return '';
    return '' + object;
};
exports.defaultToWhiteSpace = function defaultToWhiteSpace(characters) {
    if (characters == null)
        return '\\s';
    else if (characters.source)
        return characters.source;
    else
        return '[' + lodash_1.escapeRegExp(characters) + ']';
};
var kindsOf = {};
'Number String Boolean Function RegExp Array Date Error'.split(' ').forEach(function (k) {
    kindsOf['[object ' + k + ']'] = k.toLowerCase();
});
var nativeTrim = String.prototype.trim;
var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};
exports.kindOf = function kindOf(value) {
    if (value == null) {
        return String(value);
    }
    return kindsOf[kindsOf.toString.call(value)] || 'object';
};
exports.def = function def(val, def) {
    return exports.defined(val) ? val : def;
};
exports.defined = function defined(obj) {
    return lodash_1.isUndefined(obj);
};
exports.getRandomId = function getRandomId(length) {
    if (lodash_1.isNumber(length)) {
        length = 15;
    }
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
exports.guid = function guid() {
    return guidSeg() + guidSeg() + '-' + guidSeg() + '-' + guidSeg() + '-' +
        guidSeg() + '-' + guidSeg() + guidSeg() + guidSeg();
};
function guidSeg() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}
exports.guidSeg = guidSeg;
function isLength(value, lengths) {
    lengths = lengths.length === 1 && exports.kindOf(lengths[0]) === 'array' ? lengths[0] : lengths;
    var vLen;
    if (value.length)
        vLen = value.length;
    else if (isFinite(value))
        vLen = parseInt(value);
    else
        return [false];
    var lens = [];
    lengths.map(function (val) { return parseInt(val); }).forEach(function (len) { return lens[len] = vLen === len; });
    return lens;
}
exports.isAnyLength = function (value) {
    var lengths = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        lengths[_i - 1] = arguments[_i];
    }
    return isLength(value, lengths).indexOf(true) !== -1;
};
exports.isLength = exports.isAnyLength;
exports.isAllLength = function (value) {
    var lengths = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        lengths[_i - 1] = arguments[_i];
    }
    return isLength(value, lengths).indexOf(false) === -1;
};
