interface IRecursiveRecord {
    [key: string]: IRecursiveRecord | string | number | Record<string, string>[];
}
interface IFilterItem {
    keyPath: string;
    operator: string;
    value: string;
}
declare type IOrItemList = IFilterItem[];
declare type IAndItemList = IOrItemList[];
declare type IKeyValuesMap = Record<string, string[]>;
export declare class ListQuery {
    offset?: number;
    limit?: number;
    orderBy?: string;
    filterBy?: string;
    searchBy?: string;
    static parseFilter(filter: string): {
        keyPath: string;
        operator: string;
        value: string;
    };
    static parseFilterBy(filterBy?: string): {
        keyPath: string;
        operator: string;
        value: string;
    }[][] | undefined;
    static parseMustFiltersToKeyValuesMap(filterBy?: string): IKeyValuesMap;
    static convertOrderByWithDot(orderBy?: string): string | undefined;
    static getSearchData<T extends IRecursiveRecord>(searchBy: IFilterItem, sources?: T[]): T[];
    static getFilteredData<T extends IRecursiveRecord>(mustItems?: IAndItemList, sources?: T[]): T[];
    private static isStringArray;
    private static matchOptionalCondition;
    static getCompareFunction(orderBy: string): (left: IRecursiveRecord, right: IRecursiveRecord) => 1 | -1;
    private static getSourceValue;
}
export {};
