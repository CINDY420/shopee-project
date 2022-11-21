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
exports.PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPods1PodNameKillResDto = exports.PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPods1PodNameKillReqDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPods1PodNameKillReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'sduName': { required: true, type: () => String }, 'deployId': { required: true, type: () => String }, 'podName': { required: true, type: () => String }, 'clusterName': { required: true, type: () => String }, 'namespace': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPods1PodNameKillReqDto.prototype, "sduName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPods1PodNameKillReqDto.prototype, "deployId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPods1PodNameKillReqDto.prototype, "podName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPods1PodNameKillReqDto.prototype, "clusterName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPods1PodNameKillReqDto.prototype, "namespace", void 0);
exports.PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPods1PodNameKillReqDto = PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPods1PodNameKillReqDto;
class PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPods1PodNameKillResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPods1PodNameKillResDto = PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPods1PodNameKillResDto;
//# sourceMappingURL=post-ecpapi-v2-sdus-%7BsduName%7D-svcdeploys-%7BdeployId%7D-pods-%7BpodName%7D:kill.dto.js.map