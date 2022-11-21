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
exports.PostV1DepconfBindingUnbindServiceResDto = exports.PostV1DepconfBindingUnbindServiceReqDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PostV1DepconfBindingUnbindServiceReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'service_id': { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PostV1DepconfBindingUnbindServiceReqDto.prototype, "service_id", void 0);
exports.PostV1DepconfBindingUnbindServiceReqDto = PostV1DepconfBindingUnbindServiceReqDto;
class PostV1DepconfBindingUnbindServiceResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'success': { required: true, type: () => Boolean, description: "\u8BF7\u6C42\u4E1A\u52A1\u7ED3\u679C" } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PostV1DepconfBindingUnbindServiceResDto.prototype, "success", void 0);
exports.PostV1DepconfBindingUnbindServiceResDto = PostV1DepconfBindingUnbindServiceResDto;
//# sourceMappingURL=post-v1-depconf-binding-unbind_service.dto.js.map