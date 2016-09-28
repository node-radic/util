"use strict";
var lodash_1 = require('lodash');
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
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};
function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}
