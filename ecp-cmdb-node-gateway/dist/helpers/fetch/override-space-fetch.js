"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.overRideSpaceFetch = void 0;
const exception_1 = require("@infra-node-kit/exception");
const index_1 = require("../../rapper/space/index");
const common_1 = require("@nestjs/common");
const log_constant_1 = require("../constants/log.constant");
const res_code_1 = require("../constants/res-code");
function overRideSpaceFetch(axiosRef, config, authService) {
    const { baseURL } = config;
    const overrideFunc = async function ({ url, method, params, }) {
        var _a, _b;
        const token = (_b = (_a = authService.getUser()) === null || _a === void 0 ? void 0 : _a.auth) !== null && _b !== void 0 ? _b : '';
        const axiosConfig = {
            baseURL,
            method,
            url,
            headers: {
                Authorization: token,
            },
        };
        if (method.toUpperCase() === 'GET') {
            axiosConfig.params = params;
        }
        else {
            axiosConfig.data = params;
        }
        const response = await axiosRef
            .request(axiosConfig)
            .catch((error) => {
            var _a, _b;
            return (0, exception_1.throwError)({
                writeLog: false,
                message: `${method.toUpperCase()} ${baseURL}${url} error`,
                code: res_code_1.ResCode.FETCHERROR,
                status: ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) || common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                data: (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data,
            });
        })
            .then((res) => {
            if (res.data && typeof res.data.errno === 'number' && res.data.errno !== 0) {
                return (0, exception_1.throwError)({
                    action: log_constant_1.LogActions.CMDBFETCH_ERRNO,
                    message: res.data.errmsg,
                    code: res.data.errno,
                    status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                });
            }
            return res;
        });
        return response.data;
    };
    return (0, index_1.createFetch)(overrideFunc);
}
exports.overRideSpaceFetch = overRideSpaceFetch;
//# sourceMappingURL=override-space-fetch.js.map