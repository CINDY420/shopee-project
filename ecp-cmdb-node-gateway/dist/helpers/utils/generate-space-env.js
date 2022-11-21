"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSpaceEnv = void 0;
const space_auth_1 = require("@infra-node-kit/space-auth");
const generateSpaceEnv = () => {
    switch (process.env.NODE_ENV) {
        case 'local':
            return space_auth_1.SPACE_ENVIRONMENT.LOCAL;
        case 'test':
            return space_auth_1.SPACE_ENVIRONMENT.TEST;
        case 'live':
            return space_auth_1.SPACE_ENVIRONMENT.LIVE;
        default:
            return space_auth_1.SPACE_ENVIRONMENT.LIVE;
    }
};
exports.generateSpaceEnv = generateSpaceEnv;
//# sourceMappingURL=generate-space-env.js.map