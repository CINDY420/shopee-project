"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetEnabledSduAutoScalerBody = exports.GetEnabledSduAutoScalerQuery = exports.GetEnabledSduAutoScalerParam = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class GetEnabledSduAutoScalerParam {
    static _OPENAPI_METADATA_FACTORY() {
        return { sduName: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetEnabledSduAutoScalerParam.prototype, "sduName", void 0);
exports.GetEnabledSduAutoScalerParam = GetEnabledSduAutoScalerParam;
class GetEnabledSduAutoScalerQuery {
    static _OPENAPI_METADATA_FACTORY() {
        return { project: { required: true, type: () => String }, module: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetEnabledSduAutoScalerQuery.prototype, "project", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetEnabledSduAutoScalerQuery.prototype, "module", void 0);
exports.GetEnabledSduAutoScalerQuery = GetEnabledSduAutoScalerQuery;
class GetEnabledSduAutoScalerBody {
    static _OPENAPI_METADATA_FACTORY() {
        return { enabledAutoScale: { required: true, type: () => Boolean } };
    }
}
exports.GetEnabledSduAutoScalerBody = GetEnabledSduAutoScalerBody;
//# sourceMappingURL=get-enabled-sdu-auto-scaler.dto.js.map