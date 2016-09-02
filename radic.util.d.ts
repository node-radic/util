declare namespace radic.util {
    /**
     * Stringify a JSON object, supports functions
     * @param {object} obj - The json object
     * @returns {string}
     */
    function stringify(obj: any): any;
    /**
     * Parse a string into json, support functions
     * @param {string} str - The string to parse
     * @param date2obj - I forgot, sorry
     * @returns {object}
     */
    function parse(str: string, date2obj?: any): any;
    /**
     * Clone an object
     * @param {object} obj
     * @param {boolean} date2obj
     * @returns {Object}
     */
    function clone(obj: any, date2obj?: any): any;
}
declare namespace radic.util {
    interface IDelimitersCollection {
        [index: string]: IDelimiter;
    }
    interface IDelimiterLodash {
        evaluate: RegExp;
        interpolate: RegExp;
        escape: RegExp;
    }
    interface IDelimiter {
        opener?: string;
        closer?: string;
        lodash?: IDelimiterLodash;
    }
    interface IConfig {
        get(prop?: any): any;
        set(prop: string, value: any): IConfig;
        merge(obj: Object): IConfig;
        merge(prop: string, obj: Object): IConfig;
        raw(prop?: any): any;
        process(raw: any): any;
        unset(prop: any): any;
        has(prop: any): boolean;
    }
    interface IConfigProperty extends IConfig {
        (args?: any): any;
    }
    class Config implements IConfig {
        protected defaults: Object;
        protected data: Object;
        protected allDelimiters: IDelimitersCollection;
        protected static propStringTmplRe: RegExp;
        constructor(obj?: Object);
        unset(prop: any): any;
        has(prop: any): boolean;
        raw(prop?: any): any;
        get(prop?: any, def?: any): any;
        set(prop: string, value: any): IConfig;
        merge(...args: any[]): IConfig;
        process(raw: any): any;
        private addDelimiters(name, opener, closer);
        private setDelimiters(name);
        private processTemplate(tmpl, options);
        static makeProperty(config: IConfig): IConfigProperty;
        static getPropString(prop: any): string;
        static escape(str: string): string;
        toString(): any;
    }
    class PersistentConfig extends Config {
        protected persistenceFilePath: string;
        constructor(obj?: Object, persistenceFilePath?: string);
        protected save(): void;
        protected load(): void;
        unset(prop: any): any;
        merge(...args: any[]): IConfig;
        set(prop: string, value: any): IConfig;
    }
}
declare namespace radic.util {
}
declare namespace radic.util {
    function getCallerFile(_position?: number): any;
}
declare namespace radic.util {
    /**
     * Round a value to a precision
     * @param value
     * @param places
     * @returns {number}
     */
    function round(value: any, places: any): number;
    /**
     * Create a string from an object
     *
     * @param object
     * @returns {any}
     */
    function makeString(object: any): string;
    function defaultToWhiteSpace(characters: any): any;
    /**
     * Returns the method of a variablse
     *
     * @param value
     * @returns {any}
     */
    function kindOf(value: any): any;
    /**
     * If val is not defined, return def as default
     * @param val
     * @param def
     * @returns {any}
     */
    function def(val: any, def: any): any;
    /**
     * Checks wether the passed variable is defined
     *
     * @param obj
     * @returns {boolean}
     */
    function defined(obj?: any): boolean;
    /**
     * Get a random generated id string
     *
     * @param length
     * @returns {string}
     */
    function getRandomId(length?: number): string;
    function guid(): string;
}
declare namespace radic.util {
    var colors: any;
    function color(name: string, variant?: any, prefixHexSymbol?: boolean): any;
}
declare namespace radic.util {
    function getParts(str: any): any;
    /**
     * Get a child of the object using dot notation
     * @param obj
     * @param parts
     * @param create
     * @returns {any}
     */
    function objectGet(obj?: any, parts?: any, create?: any): any;
    /**
     * Set a value of a child of the object using dot notation
     * @param obj
     * @param parts
     * @param value
     * @returns {any}
     */
    function objectSet(obj: any, parts: any, value: any): any;
    /**
     * Check if a child of the object exists using dot notation
     * @param obj
     * @param parts
     * @returns {boolean|any}
     */
    function objectExists(obj: any, parts: any): boolean;
    function recurse(value: Object, fn: Function, fnContinue?: Function): any;
    /**
     * Copy an object, creating a new object and leaving the old intact
     * @param object
     * @returns {T}
     */
    function copyObject<T>(object: T): T;
    /**
     * Flatten an object to a dot notated associative array
     * @param obj
     * @param prefix
     * @returns {any}
     */
    function dotize(obj: any, prefix?: any): any;
    class StringType {
        value: string;
        constructor(value: string);
        toString(): string;
        /** Returns the primitive value of the specified object. */
        valueOf(): string;
        static all(): any[];
    }
    function applyMixins(derivedCtor: any, baseCtors: any[]): void;
    class DependencySorter {
        /**
         * @var array
         */
        protected items: any;
        /**
         * @var array
         */
        protected dependencies: any;
        /**
         * @var array
         */
        protected dependsOn: any;
        /**
         * @var array
         */
        protected missing: any;
        /**
         * @var array
         */
        protected circular: any;
        /**
         * @var array
         */
        protected hits: any;
        /**
         * @var array
         */
        protected sorted: any;
        constructor();
        add(items: {
            [name: string]: string | string[];
        }): void;
        addItem(name: string, deps?: string | string[]): void;
        setItem(name: string, deps: string[]): void;
        sort(): string[];
        protected satisfied(name: string): boolean;
        /**
         * setSorted
         *
         * @param item
         */
        protected setSorted(item: any): void;
        protected exists(item: any): boolean;
        /**
         * removeDependents
         *
         * @param item
         */
        protected removeDependents(item: any): void;
        /**
         * setCircular
         *
         * @param item
         * @param item2
         */
        protected setCircular(item: any, item2: any): void;
        /**
         * setMissing
         *
         * @param item
         * @param item2
         */
        protected setMissing(item: any, item2: any): void;
        /**
         * setFound
         *
         * @param item
         * @param item2
         */
        protected setFound(item: any, item2: any): void;
        /**
         * isSorted
         *
         * @param item
         * @return bool
         */
        protected isSorted(item: string): boolean;
        requiredBy(item: string): boolean;
        isDependent(item: string, item2: string): boolean;
        hasDependents(item: any): boolean;
        hasMissing(item: any): boolean;
        isMissing(dep: string): boolean;
        hasCircular(item: string): boolean;
        isCircular(dep: any): boolean;
        /**
         * getDependents
         *
         * @param item
         * @return mixed
         */
        getDependents(item: any): string[];
        getMissing(str?: any): string[];
        getCircular(str?: any): any;
        getHits(str?: any): any;
    }
}
declare namespace radic.util {
    enum StorageProvider {
        LOCAL = 0,
        SESSION = 1,
        COOKIE = 2,
    }
    class Storage {
        static bags: {
            [name: string]: IStorageBag;
        };
        static hasBag(name: string): boolean;
        static createBag(name: string, provider: StorageProvider): IStorageBag;
        static getBag(name: string): IStorageBag;
        private static make(name, provider);
        static isSupportedProvider(provider: IStorageBag): boolean;
    }
    interface IStorageProvider {
        length: number;
        onStoreEvent(callback: Function): any;
        clear(): void;
        getItem(key: string): any;
        key(index: number): string;
        removeItem(key: string): void;
        setItem(key: string, data: string): void;
        hasItem(key: string): boolean;
        getSize(key: any): string;
    }
    interface IStorageBag {
        get(key: any, options?: any): any;
        set(key: any, val: any, options?: any): any;
        has(key: any): boolean;
        on(callback: any): any;
        del(key: any): any;
        clear(): any;
        getSize(key: any): any;
    }
    class StorageBag implements IStorageBag {
        provider: IStorageProvider;
        constructor(provider: IStorageProvider);
        on(callback: Function): void;
        set(key: any, val: any, options?: any): void;
        get(key: any, options?: any): any;
        has(key: any): boolean;
        /**
         * Delete a value from the storage
         * @param {string|number} key
         */
        del(key: any): void;
        /**
         * Clear the storage, will clean all saved items
         */
        clear(): void;
        /**
         * Get total localstorage size in MB. If key is provided,
         * it will return size in MB only for the corresponding item.
         * @param [key]
         * @returns {string}
         */
        getSize(key: any): string;
    }
    abstract class BaseStorageProvider {
        name: string;
        constructor(name: string);
    }
    class LocalStorage extends BaseStorageProvider implements IStorageProvider {
        hasItem(key: string): boolean;
        readonly length: number;
        getSize(key: any): string;
        onStoreEvent(callback: Function): void;
        clear(): void;
        getItem(key: string): any;
        key(index: number): string;
        removeItem(key: string): void;
        setItem(key: string, data: string): void;
    }
    class SessionStorage extends BaseStorageProvider implements IStorageProvider {
        hasItem(key: string): boolean;
        readonly length: number;
        getSize(key: any): string;
        onStoreEvent(callback: Function): void;
        clear(): void;
        getItem(key: string): any;
        key(index: number): string;
        removeItem(key: string): void;
        setItem(key: string, data: string): void;
    }
    class CookieStorage extends BaseStorageProvider implements IStorageProvider {
        readonly length: number;
        getSize(key: any): string;
        cookieRegistry: any[];
        protected listenCookieChange(cookieName: any, callback: any): void;
        onStoreEvent(callback: Function): void;
        clear(): void;
        key(index: number): string;
        getItem(sKey: any): string;
        setItem(sKey: any, sValue: any, vEnd?: any, sPath?: any, sDomain?: any, bSecure?: any): void;
        removeItem(key: string, sPath?: any, sDomain?: any): boolean;
        hasItem(sKey: any): boolean;
        keys(): string[];
    }
}
