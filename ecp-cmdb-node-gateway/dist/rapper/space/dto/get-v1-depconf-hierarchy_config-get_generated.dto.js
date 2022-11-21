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
exports.GetV1DepconfHierarchyConfigGetGeneratedResDto = exports.GetV1DepconfHierarchyConfigGetGeneratedReqDto = exports.Item114237 = exports.Item114242 = exports.Item114248 = exports.Item114249 = exports.Item114255 = exports.Item114256 = exports.Item114257 = exports.Item114259 = exports.Item114262 = exports.Item114268 = exports.Item114275 = exports.Item114289 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const _1 = require(".");
class Item114289 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'key': { required: false, type: () => String }, 'operator': { required: false, type: () => String }, 'value': { required: false, type: () => String }, 'values': { required: false, type: () => [Object] } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114289.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114289.prototype, "operator", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114289.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item114289.prototype, "values", void 0);
exports.Item114289 = Item114289;
class Item114275 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'max_instances': { required: false, type: () => Number }, 'selectors': { required: false, type: () => [require("./get-v1-depconf-hierarchy_config-get_generated.dto").Item114289] }, 'unique_key': { required: false, type: () => String, description: "Only `agent_id` is supported so far." } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114275.prototype, "max_instances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114289),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item114275.prototype, "selectors", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114275.prototype, "unique_key", void 0);
exports.Item114275 = Item114275;
class Item114268 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'name': { required: false, type: () => String }, 'parameters': { required: false, type: () => require("./get-v1-depconf-hierarchy_config-get_generated.dto").Item114262 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114268.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114262),
    __metadata("design:type", Item114262)
], Item114268.prototype, "parameters", void 0);
exports.Item114268 = Item114268;
class Item114262 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'canary_stages': { required: false, type: () => [Object] }, 'disable_restart': { required: false, type: () => Boolean }, 'enable_canary_replacement': { required: false, type: () => Boolean }, 'in_place': { required: false, type: () => Boolean }, 'instances_per_agent': { required: false, type: () => Number }, 'max_surge': { required: false, type: () => String }, 'max_unavailable': { required: false, type: () => String }, 'reserve_resources': { required: false, type: () => Boolean }, 'step_down': { required: false, type: () => Number }, 'strict_in_place': { required: false, type: () => Boolean }, 'threshold': { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item114262.prototype, "canary_stages", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114262.prototype, "disable_restart", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114262.prototype, "enable_canary_replacement", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114262.prototype, "in_place", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114262.prototype, "instances_per_agent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114262.prototype, "max_surge", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114262.prototype, "max_unavailable", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114262.prototype, "reserve_resources", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114262.prototype, "step_down", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114262.prototype, "strict_in_place", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114262.prototype, "threshold", void 0);
exports.Item114262 = Item114262;
class Item114259 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'name': { required: false, type: () => String }, 'parameters': { required: false, type: () => require("./get-v1-depconf-hierarchy_config-get_generated.dto").Item114275 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114259.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114275),
    __metadata("design:type", Item114275)
], Item114259.prototype, "parameters", void 0);
exports.Item114259 = Item114259;
class Item114257 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'cpu': { required: false, type: () => Number }, 'disk': { required: false, type: () => Number }, 'gpu': { required: false, type: () => Number }, 'mem': { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114257.prototype, "cpu", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114257.prototype, "disk", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114257.prototype, "gpu", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114257.prototype, "mem", void 0);
exports.Item114257 = Item114257;
class Item114256 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'canary_init_count': { required: false, type: () => Number }, 'cluster': { required: false, type: () => String }, 'component_detail': { required: false, type: () => require("./get-v1-depconf-hierarchy_config-get_generated.dto").Item114255 }, 'enable_canary': { required: false, type: () => Boolean }, 'replicas': { required: false, type: () => Number }, 'strategy_definition': { required: false, type: () => require("./get-v1-depconf-hierarchy_config-get_generated.dto").Item114268 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114256.prototype, "canary_init_count", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114256.prototype, "cluster", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114255),
    __metadata("design:type", Item114255)
], Item114256.prototype, "component_detail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114256.prototype, "enable_canary", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114256.prototype, "replicas", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114268),
    __metadata("design:type", Item114268)
], Item114256.prototype, "strategy_definition", void 0);
exports.Item114256 = Item114256;
class Item114255 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'workload_type': { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114255.prototype, "workload_type", void 0);
exports.Item114255 = Item114255;
class Item114249 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'name': { required: false, type: () => String }, 'parameters': { required: false, type: () => require("./get-v1-depconf-hierarchy_config-get_generated.dto").Item114262 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114249.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114262),
    __metadata("design:type", Item114262)
], Item114249.prototype, "parameters", void 0);
exports.Item114249 = Item114249;
class Item114248 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'assignment_policies': { required: false, type: () => [require("./get-v1-depconf-hierarchy_config-get_generated.dto").Item114259] }, 'orchestrator': { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114259),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item114248.prototype, "assignment_policies", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114248.prototype, "orchestrator", void 0);
exports.Item114248 = Item114248;
class Item114242 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'annotations': { required: false, type: () => require("./index").ItemEmpty }, 'canary_instances': { required: false, type: () => Number }, 'canary_percent': { required: false, type: () => Number }, 'component_detail': { required: false, type: () => require("./get-v1-depconf-hierarchy_config-get_generated.dto").Item114255, description: "ECP only fields." }, 'ecp_cluster_configs': { required: false, type: () => [require("./get-v1-depconf-hierarchy_config-get_generated.dto").Item114256] }, 'instances': { required: false, type: () => Number }, 'minimum_instances': { required: false, type: () => Number }, 'resources': { required: false, type: () => require("./get-v1-depconf-hierarchy_config-get_generated.dto").Item114257 }, 'scheduler': { required: false, type: () => require("./get-v1-depconf-hierarchy_config-get_generated.dto").Item114248 }, 'strategy': { required: false, type: () => require("./get-v1-depconf-hierarchy_config-get_generated.dto").Item114249 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => _1.ItemEmpty),
    __metadata("design:type", _1.ItemEmpty)
], Item114242.prototype, "annotations", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114242.prototype, "canary_instances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114242.prototype, "canary_percent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114255),
    __metadata("design:type", Item114255)
], Item114242.prototype, "component_detail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114256),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item114242.prototype, "ecp_cluster_configs", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114242.prototype, "instances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114242.prototype, "minimum_instances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114257),
    __metadata("design:type", Item114257)
], Item114242.prototype, "resources", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114248),
    __metadata("design:type", Item114248)
], Item114242.prototype, "scheduler", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114249),
    __metadata("design:type", Item114249)
], Item114242.prototype, "strategy", void 0);
exports.Item114242 = Item114242;
class Item114237 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'az': { required: false, type: () => String }, 'az_v2': { required: false, type: () => String }, 'cid': { required: false, type: () => String }, 'data': { required: false, type: () => require("./get-v1-depconf-hierarchy_config-get_generated.dto").Item114242 }, 'deployment_zone_enum': { required: false, type: () => Number }, 'deployment_zone_name': { required: false, type: () => String }, 'deployment_zone_type': { required: false, type: () => String }, 'env': { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114237.prototype, "az", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114237.prototype, "az_v2", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114237.prototype, "cid", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114242),
    __metadata("design:type", Item114242)
], Item114237.prototype, "data", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114237.prototype, "deployment_zone_enum", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114237.prototype, "deployment_zone_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114237.prototype, "deployment_zone_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114237.prototype, "env", void 0);
exports.Item114237 = Item114237;
class GetV1DepconfHierarchyConfigGetGeneratedReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'project': { required: true, type: () => String, description: "Project module name (smm-api). Specify this or service_id" }, 'service_id': { required: true, type: () => String, description: "CMDB Service ID. Specify this or project" }, 'dz_type': { required: true, type: () => String, description: "DEPLOYMENT_ZONE_LOCAL" }, 'env': { required: true, type: () => String, description: "env" }, 'cid': { required: true, type: () => String, description: "cid" }, 'cid_group': { required: true, type: () => String, description: "cid_group" } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetV1DepconfHierarchyConfigGetGeneratedReqDto.prototype, "project", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetV1DepconfHierarchyConfigGetGeneratedReqDto.prototype, "service_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetV1DepconfHierarchyConfigGetGeneratedReqDto.prototype, "dz_type", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetV1DepconfHierarchyConfigGetGeneratedReqDto.prototype, "env", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetV1DepconfHierarchyConfigGetGeneratedReqDto.prototype, "cid", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetV1DepconfHierarchyConfigGetGeneratedReqDto.prototype, "cid_group", void 0);
exports.GetV1DepconfHierarchyConfigGetGeneratedReqDto = GetV1DepconfHierarchyConfigGetGeneratedReqDto;
class GetV1DepconfHierarchyConfigGetGeneratedResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'configs': { required: false, type: () => [require("./get-v1-depconf-hierarchy_config-get_generated.dto").Item114237] }, 'project': { required: false, type: () => String }, 'service_id': { required: false, type: () => Number }, 'success': { required: true, type: () => Boolean, description: "\u8BF7\u6C42\u4E1A\u52A1\u7ED3\u679C" } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114237),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GetV1DepconfHierarchyConfigGetGeneratedResDto.prototype, "configs", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetV1DepconfHierarchyConfigGetGeneratedResDto.prototype, "project", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetV1DepconfHierarchyConfigGetGeneratedResDto.prototype, "service_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetV1DepconfHierarchyConfigGetGeneratedResDto.prototype, "success", void 0);
exports.GetV1DepconfHierarchyConfigGetGeneratedResDto = GetV1DepconfHierarchyConfigGetGeneratedResDto;
//# sourceMappingURL=get-v1-depconf-hierarchy_config-get_generated.dto.js.map