"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfraConfig = void 0;
exports.InfraConfig = {
    config: {
        loadEnvConfig: {
            enable: true,
        },
        isGlobal: true,
    },
    logger: true,
    context: true,
    filter: {
        custom: true,
        http: true,
        unknow: true,
    },
    interceptor: {
        standardResponse: true,
    },
    middleware: {
        accessLog: true,
    },
    apm: {
        prom: false,
    },
};
//# sourceMappingURL=infra.config.js.map