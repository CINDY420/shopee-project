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
exports.GetExample1653979893461ResDto = exports.GetExample1653979893461ReqDto = exports.Item108273 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class Item108273 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'bar': { required: true, type: () => String, description: "\u6570\u7EC4\u5143\u7D20\u793A\u4F8B" }, 'foo': { required: true, type: () => Number, description: "\u6570\u7EC4\u5143\u7D20\u793A\u4F8B" } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item108273.prototype, "bar", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item108273.prototype, "foo", void 0);
exports.Item108273 = Item108273;
class GetExample1653979893461ReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'foo': { required: true, type: () => String, description: "\u8BF7\u6C42\u5C5E\u6027\u793A\u4F8B" } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetExample1653979893461ReqDto.prototype, "foo", void 0);
exports.GetExample1653979893461ReqDto = GetExample1653979893461ReqDto;
class GetExample1653979893461ResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'string': { required: true, type: () => String, description: "\u5B57\u7B26\u4E32\u5C5E\u6027\u793A\u4F8B" }, 'number': { required: true, type: () => Number, description: "\u6570\u5B57\u5C5E\u6027\u793A\u4F8B" }, 'boolean': { required: true, type: () => Boolean, description: "\u5E03\u5C14\u5C5E\u6027\u793A\u4F8B" }, 'regexp': { required: true, type: () => String, description: "\u6B63\u5219\u5C5E\u6027\u793A\u4F8B" }, 'function': { required: true, type: () => String, description: "\u51FD\u6570\u5C5E\u6027\u793A\u4F8B" }, 'array': { required: true, type: () => [require("./get-example-1653979893461.dto").Item108273], description: "\u6570\u7EC4\u5C5E\u6027\u793A\u4F8B" }, 'items': { required: true, type: () => [Object], description: "\u81EA\u5B9A\u4E49\u6570\u7EC4\u5143\u7D20\u793A\u4F8B" }, 'object': { required: true, type: () => require("./get-example-1653979893461.dto").Item108273, description: "\u5BF9\u8C61\u5C5E\u6027\u793A\u4F8B" }, 'placeholder': { required: true, type: () => String, description: "\u5360\u4F4D\u7B26\u793A\u4F8B" } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetExample1653979893461ResDto.prototype, "string", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetExample1653979893461ResDto.prototype, "number", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetExample1653979893461ResDto.prototype, "boolean", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetExample1653979893461ResDto.prototype, "regexp", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetExample1653979893461ResDto.prototype, "function", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item108273),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GetExample1653979893461ResDto.prototype, "array", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GetExample1653979893461ResDto.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item108273),
    __metadata("design:type", Item108273)
], GetExample1653979893461ResDto.prototype, "object", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetExample1653979893461ResDto.prototype, "placeholder", void 0);
exports.GetExample1653979893461ResDto = GetExample1653979893461ResDto;
//# sourceMappingURL=get-example-1653979893461.dto.js.map