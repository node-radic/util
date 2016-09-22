import {isNumber, escapeRegExp, isUndefined} from 'lodash'

    /**
     * Round a value to a precision
     * @param value
     * @param places
     * @returns {number}
     */
    export var round = function round( value, places ) {
        var multiplier = Math.pow(10, places);
        return (Math.round(value * multiplier) / multiplier);
    }


    /**
     * Create a string from an object
     *
     * @param object
     * @returns {any}
     */
    export var makeString = function makeString( object ) {
        if ( object == null ) return '';
        return '' + object;
    }



    export var defaultToWhiteSpace = function defaultToWhiteSpace( characters ) {
        if ( characters == null )
            return '\\s';
        else if ( characters.source )
            return characters.source;
        else
            return '[' + escapeRegExp(characters) + ']';
    }


    var kindsOf: any = {};
    'Number String Boolean Function RegExp Array Date Error'.split(' ').forEach(function ( k ) {
        kindsOf['[object ' + k + ']'] = k.toLowerCase();
    });
    var nativeTrim = String.prototype.trim;

    var entityMap = {
        "&" : "&amp;",
        "<" : "&lt;",
        ">" : "&gt;",
        '"' : '&quot;',
        "'" : '&#39;',
        "/" : '&#x2F;'
    };

    /**
     * Returns the method of a variablse
     *
     * @param value
     * @returns {any}
     */
    export var kindOf = function kindOf( value: any ): any {
        // Null or undefined.
        if ( value == null ) {
            return String(value);
        }
        // Everything else.
        return kindsOf[kindsOf.toString.call(value)] || 'object';
    }


    /**
     * If val is not defined, return def as default
     * @param val
     * @param def
     * @returns {any}
     */
    export var def = function def( val, def ) {
        return defined(val) ? val : def;
    }

    /**
     * Checks wether the passed variable is defined
     *
     * @param obj
     * @returns {boolean}
     */
    export var defined = function defined( obj?: any ) {
        return isUndefined(obj);
    }

    /**
     * Get a random generated id string
     *
     * @param length
     * @returns {string}
     */
    export var getRandomId = function getRandomId( length?: number ): string {
        if ( isNumber(length) ) {
            length = 15;
        }
        var text: string     = "";
        var possible: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for ( var i = 0; i < length; i++ ) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    export var guid = function guid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
                   .toString(16)
                   .substring(1);
    }


