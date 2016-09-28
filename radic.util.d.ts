
declare module "@radic/util" {
    export  var stringify: (obj: any) => any;
export  var parse: (str: string, date2obj?: any) => any;
export  var clone: (obj: any, date2obj?: any) => any;
export interface IDelimitersCollection {
    [index: string]: IDelimiter;
}
export interface IDelimiterLodash {
    evaluate: RegExp;
    interpolate: RegExp;
    escape: RegExp;
}
export interface IDelimiter {
    opener?: string;
    closer?: string;
    lodash?: IDelimiterLodash;
}
export interface IConfig {
    get(prop?: any): any;
    set(prop: string, value: any): IConfig;
    merge(obj: Object): IConfig;
    merge(prop: string, obj: Object): IConfig;
    raw(prop?: any): any;
    process(raw: any): any;
    unset(prop: any): any;
    has(prop: any): boolean;
}
export interface IConfigProperty extends IConfig {
    (args?: any): any;
}
export  class Config implements IConfig {
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
export  class PersistentConfig extends Config {
    protected persistenceFilePath: string;
    constructor(obj?: Object, persistenceFilePath?: string);
    protected save(): void;
    protected load(): void;
    unset(prop: any): any;
    merge(...args: any[]): IConfig;
    set(prop: string, value: any): IConfig;
}
export  var getCallerFile: (_position?: number) => any;
 function inspect(...args: any[]): void;
export { inspect };
export  var round: (value: any, places: any) => number;
export  var makeString: (object: any) => string;
export  var defaultToWhiteSpace: (characters: any) => any;
export  var kindOf: (value: any) => any;
export  var def: (val: any, def: any) => any;
export  var defined: (obj?: any) => boolean;
export  var getRandomId: (length?: number) => string;
export  var guid: () => string;
export  var colors: any;
export  var color: (name: string, variant?: any, prefixHexSymbol?: boolean) => any;
 function getParts(str: any): any;
 function objectGet(obj?: any, parts?: any, create?: any): any;
 function objectSet(obj: any, parts: any, value: any): any;
 function objectExists(obj: any, parts: any): boolean;
 function recurse(value: Object, fn: Function, fnContinue?: Function): any;
 function copyObject<T>(object: T): T;
 function dotize(obj: any, prefix?: any): any;
export  class StringType {
    value: string;
    constructor(value: string);
    toString(): string;
    valueOf(): string;
    static all(): any[];
}
 function applyMixins(derivedCtor: any, baseCtors: any[]): void;
export  class DependencySorter {
    protected items: any;
    protected dependencies: any;
    protected dependsOn: any;
    protected missing: any;
    protected circular: any;
    protected hits: any;
    protected sorted: any;
    constructor();
    add(items: {
        [name: string]: string | string[];
    }): void;
    addItem(name: string, deps?: string | string[]): void;
    setItem(name: string, deps: string[]): void;
    sort(): string[];
    protected satisfied(name: string): boolean;
    protected setSorted(item: any): void;
    protected exists(item: any): boolean;
    protected removeDependents(item: any): void;
    protected setCircular(item: any, item2: any): void;
    protected setMissing(item: any, item2: any): void;
    protected setFound(item: any, item2: any): void;
    protected isSorted(item: string): boolean;
    requiredBy(item: string): boolean;
    isDependent(item: string, item2: string): boolean;
    hasDependents(item: any): boolean;
    hasMissing(item: any): boolean;
    isMissing(dep: string): boolean;
    hasCircular(item: string): boolean;
    isCircular(dep: any): boolean;
    getDependents(item: any): string[];
    getMissing(str?: any): string[];
    getCircular(str?: any): any;
    getHits(str?: any): any;
}
export { getParts, objectExists, objectGet, objectSet, copyObject, applyMixins, recurse, dotize };
export  enum StorageProvider {
    LOCAL = 0,
    SESSION = 1,
    COOKIE = 2,
}
export  class Storage {
    static bags: {
        [name: string]: IStorageBag;
    };
    static hasBag(name: string): boolean;
    static createBag(name: string, provider: StorageProvider): IStorageBag;
    static getBag(name: string): IStorageBag;
    private static make(name, provider);
    static isSupportedProvider(provider: IStorageBag): boolean;
}
export interface IStorageProvider {
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
export interface IStorageBag {
    get(key: any, options?: any): any;
    set(key: any, val: any, options?: any): any;
    has(key: any): boolean;
    on(callback: any): any;
    del(key: any): any;
    clear(): any;
    getSize(key: any): any;
}
export  class StorageBag implements IStorageBag {
    provider: IStorageProvider;
    constructor(provider: IStorageProvider);
    on(callback: Function): void;
    set(key: any, val: any, options?: any): void;
    get(key: any, options?: any): any;
    has(key: any): boolean;
    del(key: any): void;
    clear(): void;
    getSize(key: any): string;
}
export  abstract class BaseStorageProvider {
    name: string;
    constructor(name: string);
}
export  class LocalStorage extends BaseStorageProvider implements IStorageProvider {
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
export  class SessionStorage extends BaseStorageProvider implements IStorageProvider {
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
export  class CookieStorage extends BaseStorageProvider implements IStorageProvider {
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
