export declare function getParts(str: any): any;
export declare function objectGet(obj?: any, parts?: any, create?: any): any;
export declare function objectSet(obj: any, parts: any, value: any): any;
export declare function objectExists(obj: any, parts: any): boolean;
export declare function recurse(value: Object, fn: Function, fnContinue?: Function): any;
export declare function copyObject<T>(object: T): T;
export declare function dotize(obj: any, prefix?: any): any;
export declare class StringType {
    value: string;
    constructor(value: string);
    toString(): string;
    valueOf(): string;
    static all(): any[];
}
export declare function applyMixins(derivedCtor: any, baseCtors: any[]): void;
export declare class DependencySorter {
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
