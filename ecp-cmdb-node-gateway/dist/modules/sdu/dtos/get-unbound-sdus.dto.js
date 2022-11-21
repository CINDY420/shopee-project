"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUnboundSDUsResponse = void 0;
const openapi = require("@nestjs/swagger");
class GetUnboundSDUsResponse {
    static _OPENAPI_METADATA_FACTORY() {
        return { sdus: { required: true, type: () => [String] } };
    }
}
exports.GetUnboundSDUsResponse = GetUnboundSDUsResponse;
//# sourceMappingURL=get-unbound-sdus.dto.js.map