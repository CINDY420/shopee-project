export declare const InfraConfig: {
    config: {
        loadEnvConfig: {
            enable: boolean;
        };
        isGlobal: boolean;
    };
    logger: boolean;
    context: boolean;
    filter: {
        custom: boolean;
        http: boolean;
        unknow: boolean;
    };
    interceptor: {
        standardResponse: boolean;
    };
    middleware: {
        accessLog: boolean;
    };
    apm: {
        prom: boolean;
    };
};
