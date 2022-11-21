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
exports.GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdResultResDto = exports.GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdResultReqDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const _1 = require(".");
class GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdResultReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'sduName': { required: true, type: () => String }, 'deployId': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdResultReqDto.prototype, "sduName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdResultReqDto.prototype, "deployId", void 0);
exports.GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdResultReqDto = GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdResultReqDto;
class GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdResultResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'status': { required: false, type: () => require("./index").ItemEmpty }, 'reason': { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => _1.ItemEmpty),
    __metadata("design:type", _1.ItemEmpty)
], GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdResultResDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdResultResDto.prototype, "reason", void 0);
exports.GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdResultResDto = GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdResultResDto;
//# sourceMappingURL=get-ecpapi-v2-sdus-%7BsduName%7D-svcdeploys-%7BdeployId%7D-result.dto.js.map