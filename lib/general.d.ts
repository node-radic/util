/**
 * Round a value to a precision
 * @param value
 * @param places
 * @returns {number}
 */
export declare var round: (value: any, places: any) => number;
/**
 * Create a string from an object
 *
 * @param object
 * @returns {any}
 */
export declare var makeString: (object: any) => string;
export declare var defaultToWhiteSpace: (characters: any) => any;
/**
 * Returns the method of a variablse
 *
 * @param value
 * @returns {any}
 */
export declare var kindOf: (value: any) => any;
/**
 * If val is not defined, return def as default
 * @param val
 * @param def
 * @returns {any}
 */
export declare var def: (val: any, def: any) => any;
/**
 * Checks wether the passed variable is defined
 *
 * @param obj
 * @returns {boolean}
 */
export declare var defined: (obj?: any) => boolean;
/**
 * Get a random generated id string
 *
 * @param length
 * @returns {string}
 */
export declare var getRandomId: (length?: number) => string;
export declare var guid: () => string;
