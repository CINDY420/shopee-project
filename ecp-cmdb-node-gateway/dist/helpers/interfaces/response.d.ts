export interface ICMDBRES<T> {
    errno: number;
    errmsg: string;
    data: T;
}
export declare type PCMDBRESRES<T> = Promise<ICMDBRES<T>>;
