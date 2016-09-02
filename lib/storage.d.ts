export declare enum StorageProvider {
    LOCAL = 0,
    SESSION = 1,
    COOKIE = 2,
}
export declare class Storage {
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
export declare class StorageBag implements IStorageBag {
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
export declare abstract class BaseStorageProvider {
    name: string;
    constructor(name: string);
}
export declare class LocalStorage extends BaseStorageProvider implements IStorageProvider {
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
export declare class SessionStorage extends BaseStorageProvider implements IStorageProvider {
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
export declare class CookieStorage extends BaseStorageProvider implements IStorageProvider {
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
