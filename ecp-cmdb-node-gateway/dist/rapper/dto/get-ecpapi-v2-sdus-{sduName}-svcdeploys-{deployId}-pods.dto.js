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
exports.GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPodsResDto = exports.GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPodsReqDto = exports.Item99605 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class Item99605 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'cid': { required: true, type: () => String }, 'clusterName': { required: true, type: () => String }, 'createdTime': { required: true, type: () => Number }, 'env': { required: true, type: () => String }, 'lastRestartTime': { required: true, type: () => Number }, 'namespace': { required: true, type: () => String }, 'nodeIp': { required: true, type: () => String }, 'nodeName': { required: true, type: () => String }, 'phase': { required: true, type: () => String }, 'podIp': { required: true, type: () => String }, 'podName': { required: true, type: () => String }, 'restartCount': { required: true, type: () => Number }, 'sdu': { required: true, type: () => String }, 'status': { required: true, type: () => String }, 'tag': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99605.prototype, "cid", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99605.prototype, "clusterName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99605.prototype, "createdTime", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99605.prototype, "env", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99605.prototype, "lastRestartTime", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99605.prototype, "namespace", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99605.prototype, "nodeIp", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99605.prototype, "nodeName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99605.prototype, "phase", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99605.prototype, "podIp", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99605.prototype, "podName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99605.prototype, "restartCount", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99605.prototype, "sdu", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99605.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99605.prototype, "tag", void 0);
exports.Item99605 = Item99605;
class GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPodsReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'sduName': { required: true, type: () => String }, 'deployId': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPodsReqDto.prototype, "sduName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPodsReqDto.prototype, "deployId", void 0);
exports.GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPodsReqDto = GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPodsReqDto;
class GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPodsResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'items': { required: true, type: () => [require("./get-ecpapi-v2-sdus-{sduName}-svcdeploys-{deployId}-pods.dto").Item99605] }, 'total': { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99605),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPodsResDto.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPodsResDto.prototype, "total", void 0);
exports.GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPodsResDto = GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPodsResDto;
//# sourceMappingURL=get-ecpapi-v2-sdus-%7BsduName%7D-svcdeploys-%7BdeployId%7D-pods.dto.js.map