"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exceptionFactory = void 0;
const exception_1 = require("@infra-node-kit/exception");
const exceptionFactory = function (errors) {
    if (errors.length > 0) {
        const error = errors.shift();
        const constraints = error.constraints;
        const contexts = error.contexts;
        for (const key in constraints) {
            let code = 400;
            if (contexts && contexts[key]) {
                code = contexts[key].errorCode;
            }
            (0, exception_1.throwError)(constraints[key] || 'request query or param has some error', code);
        }
    }
};
exports.exceptionFactory = exceptionFactory;
//# sourceMappingURL=validation-pipe-exception-factory.js.map