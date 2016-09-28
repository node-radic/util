import { isNumber, escapeRegExp, isUndefined } from 'lodash';
export var round = function round(value, places) {
    var multiplier = Math.pow(10, places);
    return (Math.round(value * multiplier) / multiplier);
};
export var makeString = function makeString(object) {
    if (object == null)
        return '';
    return '' + object;
};
export var defaultToWhiteSpace = function defaultToWhiteSpace(characters) {
    if (characters == null)
        return '\\s';
    else if (characters.source)
        return characters.source;
    else
        return '[' + escapeRegExp(characters) + ']';
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
export var kindOf = function kindOf(value) {
    if (value == null) {
        return String(value);
    }
    return kindsOf[kindsOf.toString.call(value)] || 'object';
};
export var def = function def(val, def) {
    return defined(val) ? val : def;
};
export var defined = function defined(obj) {
    return isUndefined(obj);
};
export var getRandomId = function getRandomId(length) {
    if (isNumber(length)) {
        length = 15;
    }
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
export var guid = function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};
function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}
