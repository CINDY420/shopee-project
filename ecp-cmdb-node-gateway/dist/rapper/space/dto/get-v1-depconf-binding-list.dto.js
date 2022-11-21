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
exports.GetV1DepconfBindingListResDto = exports.GetV1DepconfBindingListReqDto = exports.Item113810 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class Item113810 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'created_at': { required: false, type: () => Number }, 'deleted_at': { required: false, type: () => Number }, 'project': { required: false, type: () => String }, 'service_id': { required: false, type: () => Number }, 'service_name': { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item113810.prototype, "created_at", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item113810.prototype, "deleted_at", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113810.prototype, "project", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item113810.prototype, "service_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113810.prototype, "service_name", void 0);
exports.Item113810 = Item113810;
class GetV1DepconfBindingListReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'project': { required: false, type: () => String, description: "project module name for exact search" }, 'service_id': { required: false, type: () => Number, description: "cmdb service id" }, 'disabled': { required: false, type: () => String, description: "Returns only disabled records when true" } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetV1DepconfBindingListReqDto.prototype, "project", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetV1DepconfBindingListReqDto.prototype, "service_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetV1DepconfBindingListReqDto.prototype, "disabled", void 0);
exports.GetV1DepconfBindingListReqDto = GetV1DepconfBindingListReqDto;
class GetV1DepconfBindingListResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'projects': { required: false, type: () => [require("./get-v1-depconf-binding-list.dto").Item113810] }, 'success': { required: true, type: () => Boolean, description: "\u8BF7\u6C42\u4E1A\u52A1\u7ED3\u679C" } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item113810),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GetV1DepconfBindingListResDto.prototype, "projects", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetV1DepconfBindingListResDto.prototype, "success", void 0);
exports.GetV1DepconfBindingListResDto = GetV1DepconfBindingListResDto;
//# sourceMappingURL=get-v1-depconf-binding-list.dto.js.map