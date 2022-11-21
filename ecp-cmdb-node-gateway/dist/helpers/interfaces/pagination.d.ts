export interface IPaginationContext {
    key: string;
    countKey: string;
    defaultOrder: string;
    canPaginationFilter: boolean;
    canPaginationSearch: boolean;
    operationAfterInterceptor?: (...args: any[]) => any;
}
