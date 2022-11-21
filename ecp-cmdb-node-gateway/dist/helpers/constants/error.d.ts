import { HttpStatus } from '@nestjs/common';
export interface ICustomErrorParams {
    message: string;
    code: number;
    status: HttpStatus;
}
export declare const ERROR: {
    readonly SYSTEM_ERROR: {
        readonly OTHER: {
            readonly UNKNOWN: {
                readonly code: -10000;
                readonly status: HttpStatus.INTERNAL_SERVER_ERROR;
                readonly message: "unknown system error";
            };
        };
        readonly COMMON: {
            readonly LIST_QUERY_ERROR: {
                readonly code: -10101;
                readonly status: HttpStatus.BAD_REQUEST;
                readonly message: "unsupported list query: %s";
            };
            readonly PARSE_REQUEST_PARAMS_ERROR: {
                readonly code: -10102;
                readonly status: HttpStatus.BAD_REQUEST;
                readonly message: "parse %s error: %s";
            };
        };
        readonly CONFIG_SERVICE: {
            readonly LACK_CONFIG: {
                readonly code: -10201;
                readonly status: HttpStatus.INTERNAL_SERVER_ERROR;
                readonly message: "nest config is incomplete";
            };
        };
        readonly AUTH: {
            readonly INIT_ERROR: {
                readonly code: -10310;
                readonly status: HttpStatus.INTERNAL_SERVER_ERROR;
                readonly message: "auth init failed: can not get auth config: %s";
            };
            readonly REQUEST_ERROR: {
                readonly code: -10311;
                readonly status: HttpStatus.BAD_REQUEST;
                readonly message: "request auth service error: %s";
            };
            readonly FORBIDDEN_ERROR: {
                readonly code: -10312;
                readonly status: HttpStatus.FORBIDDEN;
                readonly message: "request forbidden";
            };
            readonly RESOURCE_FORBIDDEN_ERROR: {
                readonly code: -10313;
                readonly status: HttpStatus.FORBIDDEN;
                readonly message: "request forbidden";
            };
        };
        readonly TICKET_SERVICE: {
            readonly UNSUPPORTED_TICKET_TYPE: {
                readonly code: -10401;
                readonly status: HttpStatus.BAD_REQUEST;
                readonly message: "ticket type is unsupported now";
            };
            readonly CONFIG_LACK: {
                readonly code: -10402;
                readonly status: HttpStatus.INTERNAL_SERVER_ERROR;
                readonly message: "ticket configuration is incomplete";
            };
            readonly BAD_CONDITION: {
                readonly code: -10403;
                readonly status: HttpStatus.BAD_REQUEST;
                readonly message: "query condition is invalid";
            };
            readonly PRECONDITION_FAILED: {
                readonly code: -10404;
                readonly status: HttpStatus.PRECONDITION_FAILED;
                readonly message: "current ticket %s is not operable because it's closed";
            };
            readonly FORBIDDEN: {
                readonly code: -10405;
                readonly status: HttpStatus.FORBIDDEN;
                readonly message: "You do not have permission to do this action, %s";
            };
        };
        readonly ES_SERVICE: {
            readonly REQUEST_ERROR: {
                readonly code: -10510;
                readonly status: HttpStatus.BAD_REQUEST;
                readonly message: "request es service error: %s";
            };
        };
        readonly AUDIT_INTERCEPTOR: {
            readonly REQUEST_ERROR: {
                readonly code: -10610;
                readonly status: HttpStatus.BAD_REQUEST;
                readonly message: "request audit service error: %s";
            };
        };
        readonly MAILER: {
            readonly INIT_ERROR: {
                readonly code: -10710;
                readonly status: HttpStatus.INTERNAL_SERVER_ERROR;
                readonly message: "init mailer service error: %s";
            };
        };
    };
    readonly REMOTE_SERVICE_ERROR: {
        readonly SHOPEE_TICKET_CENTER_ERROR: {
            readonly GET_TOKEN_FAILED: {
                readonly code: -20101;
                readonly status: HttpStatus.SERVICE_UNAVAILABLE;
                readonly message: "get shopee ticket center token failed";
            };
            readonly TICKET_OPERATION_FAILED: {
                readonly code: -20102;
                readonly status: HttpStatus.SERVICE_UNAVAILABLE;
                readonly message: "ticket operation failed: %s";
            };
            readonly ASSIGNEES_LACK: {
                readonly code: -20103;
                readonly status: HttpStatus.BAD_REQUEST;
                readonly message: "ticket assignees lack";
            };
            readonly TICKET_NOT_FOUND: {
                readonly code: -20104;
                readonly status: HttpStatus.SERVICE_UNAVAILABLE;
                readonly message: "ticket does not exist";
            };
            readonly TASK_EXECUTE_FAILED: {
                readonly code: -20105;
                readonly status: HttpStatus.SERVICE_UNAVAILABLE;
                readonly message: "task execute failed: %s";
            };
            readonly SERVICE_IS_NOT_AVAILABLE: {
                readonly code: -20106;
                readonly status: HttpStatus.SERVICE_UNAVAILABLE;
                readonly message: "stc service is not available: %s";
            };
        };
        readonly OPEN_API_ERROR: {
            readonly REQUEST_ERROR: {
                readonly code: -20201;
                readonly status: HttpStatus.SERVICE_UNAVAILABLE;
                readonly message: "open api execute failed: %s";
            };
        };
        readonly SPACE_API_ERROR: {
            readonly REQUEST_ERROR: {
                readonly code: -20201;
                readonly status: HttpStatus.SERVICE_UNAVAILABLE;
                readonly message: "space api execute failed: %s";
            };
        };
    };
};
