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
exports.GetApisAutoscalerV1ServiceAcknowledgementStatusResDto = exports.GetApisAutoscalerV1ServiceAcknowledgementStatusReqDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class GetApisAutoscalerV1ServiceAcknowledgementStatusReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'project': { required: true, type: () => String }, 'module': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetApisAutoscalerV1ServiceAcknowledgementStatusReqDto.prototype, "project", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetApisAutoscalerV1ServiceAcknowledgementStatusReqDto.prototype, "module", void 0);
exports.GetApisAutoscalerV1ServiceAcknowledgementStatusReqDto = GetApisAutoscalerV1ServiceAcknowledgementStatusReqDto;
class GetApisAutoscalerV1ServiceAcknowledgementStatusResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'error_code': { required: true, type: () => Number }, 'error_message': { required: true, type: () => String }, 'toggle_state': { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetApisAutoscalerV1ServiceAcknowledgementStatusResDto.prototype, "error_code", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetApisAutoscalerV1ServiceAcknowledgementStatusResDto.prototype, "error_message", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetApisAutoscalerV1ServiceAcknowledgementStatusResDto.prototype, "toggle_state", void 0);
exports.GetApisAutoscalerV1ServiceAcknowledgementStatusResDto = GetApisAutoscalerV1ServiceAcknowledgementStatusResDto;
//# sourceMappingURL=get-apis-autoscaler-v1-service-acknowledgement_status.dto.js.map