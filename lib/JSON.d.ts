/**
 * Stringify a JSON object, supports functions
 * @param {object} obj - The json object
 * @returns {string}
 */
export declare var stringify: (obj: any) => any;
/**
 * Parse a string into json, support functions
 * @param {string} str - The string to parse
 * @param date2obj - I forgot, sorry
 * @returns {object}
 */
export declare var parse: (str: string, date2obj?: any) => any;
/**
 * Clone an object
 * @param {object} obj
 * @param {boolean} date2obj
 * @returns {Object}
 */
export declare var clone: (obj: any, date2obj?: any) => any;
