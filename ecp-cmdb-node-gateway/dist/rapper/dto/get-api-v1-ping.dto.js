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
exports.GetApiV1PingResDto = exports.GetApiV1PingReqDto = exports.Item81888 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class Item81888 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'bar': { required: false, type: () => String, description: "example array element attribute" }, 'foo': { required: false, type: () => Number, description: "example array element attribute" } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item81888.prototype, "bar", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item81888.prototype, "foo", void 0);
exports.Item81888 = Item81888;
class GetApiV1PingReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.GetApiV1PingReqDto = GetApiV1PingReqDto;
class GetApiV1PingResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'string': { required: false, type: () => String, description: "example string attribute" }, 'number': { required: false, type: () => Number, description: "example number attribute" }, 'boolean': { required: false, type: () => Boolean, description: "example boolean attribute" }, 'regexp': { required: false, type: () => String, description: "example regexp attribute" }, 'function': { required: false, type: () => String, description: "example function attribute" }, 'array': { required: false, type: () => [require("./get-api-v1-ping.dto").Item81888], description: "example array attribute" }, 'items': { required: false, type: () => [Object], description: "example customized array element attribute" }, 'object': { required: false, type: () => require("./get-api-v1-ping.dto").Item81888, description: "example object attribute" }, 'placeholder': { required: false, type: () => String, description: "example placeholder" } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetApiV1PingResDto.prototype, "string", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetApiV1PingResDto.prototype, "number", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetApiV1PingResDto.prototype, "boolean", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetApiV1PingResDto.prototype, "regexp", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetApiV1PingResDto.prototype, "function", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item81888),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GetApiV1PingResDto.prototype, "array", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GetApiV1PingResDto.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item81888),
    __metadata("design:type", Item81888)
], GetApiV1PingResDto.prototype, "object", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetApiV1PingResDto.prototype, "placeholder", void 0);
exports.GetApiV1PingResDto = GetApiV1PingResDto;
//# sourceMappingURL=get-api-v1-ping.dto.js.map