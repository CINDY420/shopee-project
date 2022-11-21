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
exports.GetV1DepconfConfigListDeploymentZoneResDto = exports.GetV1DepconfConfigListDeploymentZoneReqDto = exports.Item114066 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class Item114066 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'envs': { required: false, type: () => [Object] }, 'full_name': { required: false, type: () => String }, 'id': { required: false, type: () => Number }, 'name': { required: false, type: () => String }, 'namespace': { required: false, type: () => String }, 'zone_type': { required: false, type: () => String }, 'zone_val': { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item114066.prototype, "envs", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114066.prototype, "full_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114066.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114066.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114066.prototype, "namespace", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114066.prototype, "zone_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114066.prototype, "zone_val", void 0);
exports.Item114066 = Item114066;
class GetV1DepconfConfigListDeploymentZoneReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'project': { required: false, type: () => String, description: "Project module name (smm-api). Specify this or service_id" }, 'service_id': { required: false, type: () => String, description: "CMDB Service ID. Specify this or project" } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetV1DepconfConfigListDeploymentZoneReqDto.prototype, "project", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetV1DepconfConfigListDeploymentZoneReqDto.prototype, "service_id", void 0);
exports.GetV1DepconfConfigListDeploymentZoneReqDto = GetV1DepconfConfigListDeploymentZoneReqDto;
class GetV1DepconfConfigListDeploymentZoneResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'success': { required: true, type: () => Boolean, description: "\u8BF7\u6C42\u4E1A\u52A1\u7ED3\u679C" }, 'zones': { required: false, type: () => [require("./get-v1-depconf-config-list_deployment_zone.dto").Item114066] } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetV1DepconfConfigListDeploymentZoneResDto.prototype, "success", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114066),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GetV1DepconfConfigListDeploymentZoneResDto.prototype, "zones", void 0);
exports.GetV1DepconfConfigListDeploymentZoneResDto = GetV1DepconfConfigListDeploymentZoneResDto;
//# sourceMappingURL=get-v1-depconf-config-list_deployment_zone.dto.js.map