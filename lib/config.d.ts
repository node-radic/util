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
export declare class Config implements IConfig {
    protected defaults: Object;
    protected data: Object;
    protected allDelimiters: IDelimitersCollection;
    protected static propStringTmplRe: RegExp;
    constructor(obj?: Object);
    unset(prop: any): any;
    has(prop: any): boolean;
    raw(prop?: any): any;
    get(prop?: any): any;
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
export declare class PersistentConfig extends Config {
    protected persistenceFilePath: string;
    constructor(obj?: Object, persistenceFilePath?: string);
    protected save(): void;
    protected load(): void;
    unset(prop: any): any;
    merge(...args: any[]): IConfig;
    set(prop: string, value: any): IConfig;
}
