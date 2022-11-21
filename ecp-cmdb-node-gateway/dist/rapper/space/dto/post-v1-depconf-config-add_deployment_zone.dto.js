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
exports.PostV1DepconfConfigAddDeploymentZoneResDto = exports.PostV1DepconfConfigAddDeploymentZoneReqDto = exports.Item113871 = exports.Item113872 = exports.Item113875 = exports.Item113876 = exports.Item113885 = exports.Item113887 = exports.Item113888 = exports.Item113889 = exports.Item113890 = exports.Item113894 = exports.Item113896 = exports.Item113900 = exports.Item113906 = exports.Item113920 = exports.Item113923 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class Item113923 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'key': { required: false, type: () => String }, 'operator': { required: false, type: () => String }, 'value': { required: false, type: () => String }, 'values': { required: false, type: () => [Object] } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113923.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113923.prototype, "operator", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113923.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item113923.prototype, "values", void 0);
exports.Item113923 = Item113923;
class Item113920 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'max_instances': { required: false, type: () => Number }, 'selectors': { required: false, type: () => [require("./post-v1-depconf-config-add_deployment_zone.dto").Item113923] }, 'unique_key': { required: false, type: () => String, description: "Only `agent_id` is supported so far." } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item113920.prototype, "max_instances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item113923),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item113920.prototype, "selectors", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113920.prototype, "unique_key", void 0);
exports.Item113920 = Item113920;
class Item113906 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'name': { required: false, type: () => String }, 'parameters': { required: false, type: () => require("./post-v1-depconf-config-add_deployment_zone.dto").Item113920 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113906.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item113920),
    __metadata("design:type", Item113920)
], Item113906.prototype, "parameters", void 0);
exports.Item113906 = Item113906;
class Item113900 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'canary_stages': { required: false, type: () => [Object] }, 'disable_restart': { required: false, type: () => Boolean }, 'enable_canary_replacement': { required: false, type: () => Boolean }, 'in_place': { required: false, type: () => Boolean }, 'instances_per_agent': { required: false, type: () => Number }, 'max_surge': { required: false, type: () => String }, 'max_unavailable': { required: false, type: () => String }, 'reserve_resources': { required: false, type: () => Boolean }, 'step_down': { required: false, type: () => Number }, 'strict_in_place': { required: false, type: () => Boolean }, 'threshold': { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item113900.prototype, "canary_stages", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item113900.prototype, "disable_restart", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item113900.prototype, "enable_canary_replacement", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item113900.prototype, "in_place", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item113900.prototype, "instances_per_agent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113900.prototype, "max_surge", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113900.prototype, "max_unavailable", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item113900.prototype, "reserve_resources", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item113900.prototype, "step_down", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item113900.prototype, "strict_in_place", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item113900.prototype, "threshold", void 0);
exports.Item113900 = Item113900;
class Item113896 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'final': { required: false, type: () => String }, 'stages': { required: false, type: () => [Object] } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113896.prototype, "final", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item113896.prototype, "stages", void 0);
exports.Item113896 = Item113896;
class Item113894 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'name': { required: false, type: () => String }, 'parameters': { required: false, type: () => require("./post-v1-depconf-config-add_deployment_zone.dto").Item113900 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113894.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item113900),
    __metadata("design:type", Item113900)
], Item113894.prototype, "parameters", void 0);
exports.Item113894 = Item113894;
class Item113890 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'instances': { required: false, type: () => String }, 'mode': { required: false, type: () => String }, 'multi_stage': { required: false, type: () => require("./post-v1-depconf-config-add_deployment_zone.dto").Item113896 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113890.prototype, "instances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113890.prototype, "mode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item113896),
    __metadata("design:type", Item113896)
], Item113890.prototype, "multi_stage", void 0);
exports.Item113890 = Item113890;
class Item113889 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'assignment_policies': { required: false, type: () => [require("./post-v1-depconf-config-add_deployment_zone.dto").Item113906] } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item113906),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item113889.prototype, "assignment_policies", void 0);
exports.Item113889 = Item113889;
class Item113888 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'cpu': { required: false, type: () => Number }, 'disk': { required: false, type: () => Number }, 'gpu': { required: false, type: () => Number }, 'mem': { required: false, type: () => Number }, 'skip_mem_limit_check': { required: false, type: () => Boolean } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item113888.prototype, "cpu", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item113888.prototype, "disk", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item113888.prototype, "gpu", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item113888.prototype, "mem", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item113888.prototype, "skip_mem_limit_check", void 0);
exports.Item113888 = Item113888;
class Item113887 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'enabled': { required: false, type: () => Boolean } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item113887.prototype, "enabled", void 0);
exports.Item113887 = Item113887;
class Item113885 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'canary': { required: false, type: () => require("./post-v1-depconf-config-add_deployment_zone.dto").Item113890 }, 'enabled': { required: false, type: () => Boolean }, 'instances': { required: false, type: () => Number }, 'minimum_instances': { required: false, type: () => Number }, 'resources': { required: false, type: () => require("./post-v1-depconf-config-add_deployment_zone.dto").Item113888 }, 'scheduler': { required: false, type: () => require("./post-v1-depconf-config-add_deployment_zone.dto").Item113889 }, 'strategy': { required: false, type: () => require("./post-v1-depconf-config-add_deployment_zone.dto").Item113894 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item113890),
    __metadata("design:type", Item113890)
], Item113885.prototype, "canary", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item113885.prototype, "enabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item113885.prototype, "instances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item113885.prototype, "minimum_instances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item113888),
    __metadata("design:type", Item113888)
], Item113885.prototype, "resources", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item113889),
    __metadata("design:type", Item113889)
], Item113885.prototype, "scheduler", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item113894),
    __metadata("design:type", Item113894)
], Item113885.prototype, "strategy", void 0);
exports.Item113885 = Item113885;
class Item113876 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'container': { required: false, type: () => require("./post-v1-depconf-config-add_deployment_zone.dto").Item113885 }, 'env': { required: false, type: () => String }, 'static_files': { required: false, type: () => require("./post-v1-depconf-config-add_deployment_zone.dto").Item113887 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item113885),
    __metadata("design:type", Item113885)
], Item113876.prototype, "container", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113876.prototype, "env", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item113887),
    __metadata("design:type", Item113887)
], Item113876.prototype, "static_files", void 0);
exports.Item113876 = Item113876;
class Item113875 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'envs': { required: false, type: () => [Object] }, 'full_name': { required: false, type: () => String }, 'id': { required: false, type: () => Number }, 'name': { required: false, type: () => String }, 'namespace': { required: false, type: () => String }, 'zone_type': { required: false, type: () => String }, 'zone_val': { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item113875.prototype, "envs", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113875.prototype, "full_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item113875.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113875.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113875.prototype, "namespace", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113875.prototype, "zone_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item113875.prototype, "zone_val", void 0);
exports.Item113875 = Item113875;
class Item113872 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'envs': { required: false, type: () => [require("./post-v1-depconf-config-add_deployment_zone.dto").Item113876] } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item113876),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item113872.prototype, "envs", void 0);
exports.Item113872 = Item113872;
class Item113871 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'definition': { required: false, type: () => require("./post-v1-depconf-config-add_deployment_zone.dto").Item113872 }, 'dz_type': { required: false, type: () => String }, 'zone_id': { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item113872),
    __metadata("design:type", Item113872)
], Item113871.prototype, "definition", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113871.prototype, "dz_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item113871.prototype, "zone_id", void 0);
exports.Item113871 = Item113871;
class PostV1DepconfConfigAddDeploymentZoneReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'project': { required: false, type: () => String, description: "Project is a combination of $project-$module" }, 'service_id': { required: false, type: () => Number, description: "CMDB Service ID" }, 'zones': { required: false, type: () => [require("./post-v1-depconf-config-add_deployment_zone.dto").Item113871] } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV1DepconfConfigAddDeploymentZoneReqDto.prototype, "project", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PostV1DepconfConfigAddDeploymentZoneReqDto.prototype, "service_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item113871),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], PostV1DepconfConfigAddDeploymentZoneReqDto.prototype, "zones", void 0);
exports.PostV1DepconfConfigAddDeploymentZoneReqDto = PostV1DepconfConfigAddDeploymentZoneReqDto;
class PostV1DepconfConfigAddDeploymentZoneResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'bound_zones': { required: false, type: () => [require("./post-v1-depconf-config-add_deployment_zone.dto").Item113875] }, 'success': { required: true, type: () => Boolean, description: "\u8BF7\u6C42\u4E1A\u52A1\u7ED3\u679C" } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item113875),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], PostV1DepconfConfigAddDeploymentZoneResDto.prototype, "bound_zones", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PostV1DepconfConfigAddDeploymentZoneResDto.prototype, "success", void 0);
exports.PostV1DepconfConfigAddDeploymentZoneResDto = PostV1DepconfConfigAddDeploymentZoneResDto;
//# sourceMappingURL=post-v1-depconf-config-add_deployment_zone.dto.js.map