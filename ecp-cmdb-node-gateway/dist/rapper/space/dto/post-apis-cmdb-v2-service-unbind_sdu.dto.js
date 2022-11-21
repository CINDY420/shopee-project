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
exports.PostApisCmdbV2ServiceUnbindSduResDto = exports.PostApisCmdbV2ServiceUnbindSduReqDto = exports.Item141503 = exports.Item141504 = exports.Item141507 = exports.Item141514 = exports.Item141525 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const _1 = require(".");
class Item141525 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'created_at': { required: true, type: () => Number }, 'enabled': { required: true, type: () => Boolean }, 'sdu_id': { required: true, type: () => Number }, 'service_id': { required: true, type: () => Number }, 'service_sdu_relation_id': { required: true, type: () => Number }, 'updated_at': { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item141525.prototype, "created_at", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item141525.prototype, "enabled", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item141525.prototype, "sdu_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item141525.prototype, "service_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item141525.prototype, "service_sdu_relation_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item141525.prototype, "updated_at", void 0);
exports.Item141525 = Item141525;
class Item141514 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'cid': { required: true, type: () => String }, 'created_at': { required: true, type: () => Number }, 'deployment_link': { required: true, type: () => String }, 'env': { required: true, type: () => String }, 'idcs': { required: true, type: () => [String] }, 'label': { required: true, type: () => require("./index").ItemEmpty }, 'resource_type': { required: true, type: () => String }, 'sdu': { required: true, type: () => String }, 'updated_at': { required: true, type: () => Number }, 'version': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item141514.prototype, "cid", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item141514.prototype, "created_at", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item141514.prototype, "deployment_link", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item141514.prototype, "env", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item141514.prototype, "idcs", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => _1.ItemEmpty),
    __metadata("design:type", _1.ItemEmpty)
], Item141514.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item141514.prototype, "resource_type", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item141514.prototype, "sdu", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item141514.prototype, "updated_at", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item141514.prototype, "version", void 0);
exports.Item141514 = Item141514;
class Item141507 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'spexible': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item141507.prototype, "spexible", void 0);
exports.Item141507 = Item141507;
class Item141504 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'created_at': { required: true, type: () => Number }, 'data': { required: true, type: () => require("./post-apis-cmdb-v2-service-unbind_sdu.dto").Item141507 }, 'enabled': { required: true, type: () => Boolean }, 'service_id': { required: true, type: () => Number }, 'service_name': { required: true, type: () => String }, 'service_owners': { required: true, type: () => [Object] }, 'updated_at': { required: true, type: () => Number }, 'updated_by': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item141504.prototype, "created_at", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item141507),
    __metadata("design:type", Item141507)
], Item141504.prototype, "data", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item141504.prototype, "enabled", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item141504.prototype, "service_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item141504.prototype, "service_name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item141504.prototype, "service_owners", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item141504.prototype, "updated_at", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item141504.prototype, "updated_by", void 0);
exports.Item141504 = Item141504;
class Item141503 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'sdu': { required: true, type: () => require("./post-apis-cmdb-v2-service-unbind_sdu.dto").Item141514 }, 'service': { required: true, type: () => require("./post-apis-cmdb-v2-service-unbind_sdu.dto").Item141504 }, 'unbind': { required: true, type: () => require("./post-apis-cmdb-v2-service-unbind_sdu.dto").Item141525 } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item141514),
    __metadata("design:type", Item141514)
], Item141503.prototype, "sdu", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item141504),
    __metadata("design:type", Item141504)
], Item141503.prototype, "service", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item141525),
    __metadata("design:type", Item141525)
], Item141503.prototype, "unbind", void 0);
exports.Item141503 = Item141503;
class PostApisCmdbV2ServiceUnbindSduReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'service_name': { required: true, type: () => String }, 'resource_type': { required: true, type: () => String, description: "CONTAINER / PHYSICAL / STATIC / AUTODISCOVERY" }, 'sdu': { required: true, type: () => String }, 'force': { required: false, type: () => Boolean, description: "\u9ED8\u8BA4false" } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostApisCmdbV2ServiceUnbindSduReqDto.prototype, "service_name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostApisCmdbV2ServiceUnbindSduReqDto.prototype, "resource_type", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostApisCmdbV2ServiceUnbindSduReqDto.prototype, "sdu", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PostApisCmdbV2ServiceUnbindSduReqDto.prototype, "force", void 0);
exports.PostApisCmdbV2ServiceUnbindSduReqDto = PostApisCmdbV2ServiceUnbindSduReqDto;
class PostApisCmdbV2ServiceUnbindSduResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'unbounded': { required: true, type: () => [require("./post-apis-cmdb-v2-service-unbind_sdu.dto").Item141503] } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item141503),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], PostApisCmdbV2ServiceUnbindSduResDto.prototype, "unbounded", void 0);
exports.PostApisCmdbV2ServiceUnbindSduResDto = PostApisCmdbV2ServiceUnbindSduResDto;
//# sourceMappingURL=post-apis-cmdb-v2-service-unbind_sdu.dto.js.map