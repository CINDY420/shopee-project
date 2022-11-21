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
exports.BindSDUsBody = exports.BindSDUsParam = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class BindSDUsParam {
    static _OPENAPI_METADATA_FACTORY() {
        return { serviceName: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BindSDUsParam.prototype, "serviceName", void 0);
exports.BindSDUsParam = BindSDUsParam;
class BindSDUsBody {
    static _OPENAPI_METADATA_FACTORY() {
        return { sdus: { required: true, type: () => [String] }, force: { required: false, type: () => Boolean } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BindSDUsBody.prototype, "sdus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BindSDUsBody.prototype, "force", void 0);
exports.BindSDUsBody = BindSDUsBody;
//# sourceMappingURL=bind-sdus.dto.js.map