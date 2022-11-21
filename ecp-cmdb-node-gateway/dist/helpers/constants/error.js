"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR = void 0;
const common_1 = require("@nestjs/common");
const SYSTEM_ERROR = {
    OTHER: {
        UNKNOWN: {
            code: -10000,
            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'unknown system error',
        },
    },
    COMMON: {
        LIST_QUERY_ERROR: {
            code: -10101,
            status: common_1.HttpStatus.BAD_REQUEST,
            message: 'unsupported list query: %s',
        },
        PARSE_REQUEST_PARAMS_ERROR: {
            code: -10102,
            status: common_1.HttpStatus.BAD_REQUEST,
            message: 'parse %s error: %s',
        },
    },
    CONFIG_SERVICE: {
        LACK_CONFIG: {
            code: -10201,
            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'nest config is incomplete',
        },
    },
    AUTH: {
        INIT_ERROR: {
            code: -10310,
            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'auth init failed: can not get auth config: %s',
        },
        REQUEST_ERROR: {
            code: -10311,
            status: common_1.HttpStatus.BAD_REQUEST,
            message: 'request auth service error: %s',
        },
        FORBIDDEN_ERROR: {
            code: -10312,
            status: common_1.HttpStatus.FORBIDDEN,
            message: 'request forbidden',
        },
        RESOURCE_FORBIDDEN_ERROR: {
            code: -10313,
            status: common_1.HttpStatus.FORBIDDEN,
            message: 'request forbidden',
        },
    },
    TICKET_SERVICE: {
        UNSUPPORTED_TICKET_TYPE: {
            code: -10401,
            status: common_1.HttpStatus.BAD_REQUEST,
            message: 'ticket type is unsupported now',
        },
        CONFIG_LACK: {
            code: -10402,
            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'ticket configuration is incomplete',
        },
        BAD_CONDITION: {
            code: -10403,
            status: common_1.HttpStatus.BAD_REQUEST,
            message: 'query condition is invalid',
        },
        PRECONDITION_FAILED: {
            code: -10404,
            status: common_1.HttpStatus.PRECONDITION_FAILED,
            message: "current ticket %s is not operable because it's closed",
        },
        FORBIDDEN: {
            code: -10405,
            status: common_1.HttpStatus.FORBIDDEN,
            message: 'You do not have permission to do this action, %s',
        },
    },
    ES_SERVICE: {
        REQUEST_ERROR: {
            code: -10510,
            status: common_1.HttpStatus.BAD_REQUEST,
            message: 'request es service error: %s',
        },
    },
    AUDIT_INTERCEPTOR: {
        REQUEST_ERROR: {
            code: -10610,
            status: common_1.HttpStatus.BAD_REQUEST,
            message: 'request audit service error: %s',
        },
    },
    MAILER: {
        INIT_ERROR: {
            code: -10710,
            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'init mailer service error: %s',
        },
    },
};
const REMOTE_SERVICE_ERROR = {
    SHOPEE_TICKET_CENTER_ERROR: {
        GET_TOKEN_FAILED: {
            code: -20101,
            status: common_1.HttpStatus.SERVICE_UNAVAILABLE,
            message: 'get shopee ticket center token failed',
        },
        TICKET_OPERATION_FAILED: {
            code: -20102,
            status: common_1.HttpStatus.SERVICE_UNAVAILABLE,
            message: 'ticket operation failed: %s',
        },
        ASSIGNEES_LACK: {
            code: -20103,
            status: common_1.HttpStatus.BAD_REQUEST,
            message: 'ticket assignees lack',
        },
        TICKET_NOT_FOUND: {
            code: -20104,
            status: common_1.HttpStatus.SERVICE_UNAVAILABLE,
            message: 'ticket does not exist',
        },
        TASK_EXECUTE_FAILED: {
            code: -20105,
            status: common_1.HttpStatus.SERVICE_UNAVAILABLE,
            message: 'task execute failed: %s',
        },
        SERVICE_IS_NOT_AVAILABLE: {
            code: -20106,
            status: common_1.HttpStatus.SERVICE_UNAVAILABLE,
            message: 'stc service is not available: %s',
        },
    },
    OPEN_API_ERROR: {
        REQUEST_ERROR: {
            code: -20201,
            status: common_1.HttpStatus.SERVICE_UNAVAILABLE,
            message: 'open api execute failed: %s',
        },
    },
    SPACE_API_ERROR: {
        REQUEST_ERROR: {
            code: -20201,
            status: common_1.HttpStatus.SERVICE_UNAVAILABLE,
            message: 'space api execute failed: %s',
        },
    },
};
exports.ERROR = {
    SYSTEM_ERROR,
    REMOTE_SERVICE_ERROR,
};
//# sourceMappingURL=error.js.map