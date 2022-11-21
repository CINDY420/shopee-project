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
exports.PostApisCmdbV2ServiceBindSduResDto = exports.PostApisCmdbV2ServiceBindSduReqDto = exports.Item141466 = exports.Item141467 = exports.Item141470 = exports.Item141477 = exports.Item141488 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const _1 = require(".");
class Item141488 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'created_at': { required: true, type: () => Number }, 'enabled': { required: true, type: () => Boolean }, 'sdu_id': { required: true, type: () => Number }, 'service_id': { required: true, type: () => Number }, 'service_sdu_relation_id': { required: true, type: () => Number }, 'updated_at': { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item141488.prototype, "created_at", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item141488.prototype, "enabled", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item141488.prototype, "sdu_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item141488.prototype, "service_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item141488.prototype, "service_sdu_relation_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item141488.prototype, "updated_at", void 0);
exports.Item141488 = Item141488;
class Item141477 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'cid': { required: true, type: () => String }, 'created_at': { required: true, type: () => Number }, 'deployment_link': { required: true, type: () => String }, 'env': { required: true, type: () => String }, 'idcs': { required: true, type: () => [String] }, 'label': { required: true, type: () => require("./index").ItemEmpty }, 'sdu': { required: true, type: () => String }, 'sdu_type': { required: true, type: () => String }, 'updated_at': { required: true, type: () => Number }, 'version': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item141477.prototype, "cid", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item141477.prototype, "created_at", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item141477.prototype, "deployment_link", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item141477.prototype, "env", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item141477.prototype, "idcs", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => _1.ItemEmpty),
    __metadata("design:type", _1.ItemEmpty)
], Item141477.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item141477.prototype, "sdu", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item141477.prototype, "sdu_type", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item141477.prototype, "updated_at", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item141477.prototype, "version", void 0);
exports.Item141477 = Item141477;
class Item141470 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'spexible': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item141470.prototype, "spexible", void 0);
exports.Item141470 = Item141470;
class Item141467 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'created_at': { required: true, type: () => Number }, 'data': { required: true, type: () => require("./post-apis-cmdb-v2-service-bind_sdu.dto").Item141470 }, 'enabled': { required: true, type: () => Boolean }, 'service_id': { required: true, type: () => Number }, 'service_name': { required: true, type: () => String }, 'service_owners': { required: true, type: () => [Object] }, 'updated_at': { required: true, type: () => Number }, 'updated_by': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item141467.prototype, "created_at", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item141470),
    __metadata("design:type", Item141470)
], Item141467.prototype, "data", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item141467.prototype, "enabled", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item141467.prototype, "service_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item141467.prototype, "service_name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item141467.prototype, "service_owners", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item141467.prototype, "updated_at", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item141467.prototype, "updated_by", void 0);
exports.Item141467 = Item141467;
class Item141466 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'bind': { required: true, type: () => require("./post-apis-cmdb-v2-service-bind_sdu.dto").Item141488 }, 'sdu': { required: true, type: () => require("./post-apis-cmdb-v2-service-bind_sdu.dto").Item141477 }, 'service': { required: true, type: () => require("./post-apis-cmdb-v2-service-bind_sdu.dto").Item141467 } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item141488),
    __metadata("design:type", Item141488)
], Item141466.prototype, "bind", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item141477),
    __metadata("design:type", Item141477)
], Item141466.prototype, "sdu", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item141467),
    __metadata("design:type", Item141467)
], Item141466.prototype, "service", void 0);
exports.Item141466 = Item141466;
class PostApisCmdbV2ServiceBindSduReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'service_name': { required: true, type: () => String }, 'resource_type': { required: true, type: () => String, description: "CONTAINER / PHYSICAL / STATIC / AUTODISCOVERY" }, 'sdu': { required: true, type: () => String }, 'force': { required: false, type: () => Boolean, description: "\u9ED8\u8BA4false" } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostApisCmdbV2ServiceBindSduReqDto.prototype, "service_name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostApisCmdbV2ServiceBindSduReqDto.prototype, "resource_type", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostApisCmdbV2ServiceBindSduReqDto.prototype, "sdu", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PostApisCmdbV2ServiceBindSduReqDto.prototype, "force", void 0);
exports.PostApisCmdbV2ServiceBindSduReqDto = PostApisCmdbV2ServiceBindSduReqDto;
class PostApisCmdbV2ServiceBindSduResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'bounded': { required: true, type: () => [require("./post-apis-cmdb-v2-service-bind_sdu.dto").Item141466] } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item141466),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], PostApisCmdbV2ServiceBindSduResDto.prototype, "bounded", void 0);
exports.PostApisCmdbV2ServiceBindSduResDto = PostApisCmdbV2ServiceBindSduResDto;
//# sourceMappingURL=post-apis-cmdb-v2-service-bind_sdu.dto.js.map