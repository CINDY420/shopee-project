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
exports.PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdRollbackResDto = exports.PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdRollbackReqDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdRollbackReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'sduName': { required: true, type: () => String }, 'deployId': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdRollbackReqDto.prototype, "sduName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdRollbackReqDto.prototype, "deployId", void 0);
exports.PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdRollbackReqDto = PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdRollbackReqDto;
class PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdRollbackResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdRollbackResDto = PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdRollbackResDto;
//# sourceMappingURL=post-ecpapi-v2-sdus-%7BsduName%7D-svcdeploys-%7BdeployId%7D:rollback.dto.js.map