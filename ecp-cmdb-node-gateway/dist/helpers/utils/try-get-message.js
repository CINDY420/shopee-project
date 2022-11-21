"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryGetMessage = void 0;
function tryGetMessage(body) {
    if (typeof body === 'object' && body !== null && 'message' in body) {
        return body.message;
    }
    return '';
}
exports.tryGetMessage = tryGetMessage;
//# sourceMappingURL=try-get-message.js.map