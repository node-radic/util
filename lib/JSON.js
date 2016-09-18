"use strict";
var old_json = JSON;
/**
 * Stringify a JSON object, supports functions
 * @param {object} obj - The json object
 * @returns {string}
 */
exports.stringify = function stringify(obj) {
    return old_json.stringify(obj, function (key, value) {
        if (value instanceof Function || typeof value == 'function') {
            return value.toString();
        }
        if (value instanceof RegExp) {
            return '_PxEgEr_' + value;
        }
        return value;
    });
};
/**
 * Parse a string into json, support functions
 * @param {string} str - The string to parse
 * @param date2obj - I forgot, sorry
 * @returns {object}
 */
exports.parse = function parse(str, date2obj) {
    var iso8061 = date2obj ? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/ : false;
    return old_json.parse(str, function (key, value) {
        var prefix;
        if (typeof value != 'string') {
            return value;
        }
        if (value.length < 8) {
            return value;
        }
        prefix = value.substring(0, 8);
        if (iso8061 && value.match(iso8061)) {
            return new Date(value);
        }
        if (prefix === 'function') {
            return eval('(' + value + ')');
        }
        if (prefix === '_PxEgEr_') {
            return eval(value.slice(8));
        }
        return value;
    });
};
/**
 * Clone an object
 * @param {object} obj
 * @param {boolean} date2obj
 * @returns {Object}
 */
exports.clone = function clone(obj, date2obj) {
    return exports.parse(exports.stringify(obj), date2obj);
};
//# sourceMappingURL=JSON.js.map