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
exports.GetV1DepconfDeploymentzoneListResDto = exports.GetV1DepconfDeploymentzoneListReqDto = exports.Item114126 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class Item114126 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'envs': { required: false, type: () => [Object] }, 'full_name': { required: false, type: () => String }, 'id': { required: false, type: () => Number }, 'name': { required: false, type: () => String }, 'namespace': { required: false, type: () => String }, 'zone_type': { required: false, type: () => String }, 'zone_val': { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item114126.prototype, "envs", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114126.prototype, "full_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114126.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114126.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114126.prototype, "namespace", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114126.prototype, "zone_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114126.prototype, "zone_val", void 0);
exports.Item114126 = Item114126;
class GetV1DepconfDeploymentzoneListReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.GetV1DepconfDeploymentzoneListReqDto = GetV1DepconfDeploymentzoneListReqDto;
class GetV1DepconfDeploymentzoneListResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'success': { required: true, type: () => Boolean, description: "\u8BF7\u6C42\u4E1A\u52A1\u7ED3\u679C" }, 'zones': { required: false, type: () => [require("./get-v1-depconf-deploymentzone-list.dto").Item114126] } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetV1DepconfDeploymentzoneListResDto.prototype, "success", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114126),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GetV1DepconfDeploymentzoneListResDto.prototype, "zones", void 0);
exports.GetV1DepconfDeploymentzoneListResDto = GetV1DepconfDeploymentzoneListResDto;
//# sourceMappingURL=get-v1-depconf-deploymentzone-list.dto.js.map