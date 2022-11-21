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
exports.PostV1DepconfConfigUpdateInstancesResDto = exports.PostV1DepconfConfigUpdateInstancesReqDto = exports.Item114092 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class Item114092 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'cid': { required: true, type: () => String }, 'count': { required: true, type: () => Number }, 'idc': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114092.prototype, "cid", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114092.prototype, "count", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114092.prototype, "idc", void 0);
exports.Item114092 = Item114092;
class PostV1DepconfConfigUpdateInstancesReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'comment': { required: false, type: () => String }, 'email': { required: false, type: () => String }, 'env': { required: true, type: () => String }, 'project': { required: false, type: () => String }, 'requests': { required: false, type: () => [require("./post-v1-depconf-config-update_instances.dto").Item114092] }, 'service_id': { required: false, type: () => Number }, 'service_meta_type': { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV1DepconfConfigUpdateInstancesReqDto.prototype, "comment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV1DepconfConfigUpdateInstancesReqDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV1DepconfConfigUpdateInstancesReqDto.prototype, "env", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV1DepconfConfigUpdateInstancesReqDto.prototype, "project", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114092),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], PostV1DepconfConfigUpdateInstancesReqDto.prototype, "requests", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PostV1DepconfConfigUpdateInstancesReqDto.prototype, "service_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV1DepconfConfigUpdateInstancesReqDto.prototype, "service_meta_type", void 0);
exports.PostV1DepconfConfigUpdateInstancesReqDto = PostV1DepconfConfigUpdateInstancesReqDto;
class PostV1DepconfConfigUpdateInstancesResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.PostV1DepconfConfigUpdateInstancesResDto = PostV1DepconfConfigUpdateInstancesResDto;
//# sourceMappingURL=post-v1-depconf-config-update_instances.dto.js.map