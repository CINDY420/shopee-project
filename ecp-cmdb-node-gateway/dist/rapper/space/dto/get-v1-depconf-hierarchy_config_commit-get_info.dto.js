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
exports.GetV1DepconfHierarchyConfigCommitGetInfoResDto = exports.GetV1DepconfHierarchyConfigCommitGetInfoReqDto = exports.Item114574 = exports.Item114578 = exports.Item114589 = exports.Item114604 = exports.Item114606 = exports.Item114608 = exports.Item114609 = exports.Item114610 = exports.Item114617 = exports.Item114619 = exports.Item114626 = exports.Item114644 = exports.Item114655 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const _1 = require(".");
class Item114655 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'key': { required: false, type: () => String }, 'operator': { required: false, type: () => String }, 'value': { required: false, type: () => String }, 'values': { required: false, type: () => [Object] } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114655.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114655.prototype, "operator", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114655.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item114655.prototype, "values", void 0);
exports.Item114655 = Item114655;
class Item114644 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'max_instances': { required: false, type: () => Number }, 'selectors': { required: false, type: () => [require("./get-v1-depconf-hierarchy_config_commit-get_info.dto").Item114655] }, 'unique_key': { required: false, type: () => String, description: "Only `agent_id` is supported so far." } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114644.prototype, "max_instances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114655),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item114644.prototype, "selectors", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114644.prototype, "unique_key", void 0);
exports.Item114644 = Item114644;
class Item114626 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'name': { required: false, type: () => String }, 'parameters': { required: false, type: () => require("./get-v1-depconf-hierarchy_config_commit-get_info.dto").Item114644 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114626.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114644),
    __metadata("design:type", Item114644)
], Item114626.prototype, "parameters", void 0);
exports.Item114626 = Item114626;
class Item114619 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'canary_stages': { required: false, type: () => [Object] }, 'disable_restart': { required: false, type: () => Boolean }, 'enable_canary_replacement': { required: false, type: () => Boolean }, 'in_place': { required: false, type: () => Boolean }, 'instances_per_agent': { required: false, type: () => Number }, 'max_surge': { required: false, type: () => String }, 'max_unavailable': { required: false, type: () => String }, 'reserve_resources': { required: false, type: () => Boolean }, 'step_down': { required: false, type: () => Number }, 'strict_in_place': { required: false, type: () => Boolean }, 'threshold': { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item114619.prototype, "canary_stages", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114619.prototype, "disable_restart", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114619.prototype, "enable_canary_replacement", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114619.prototype, "in_place", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114619.prototype, "instances_per_agent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114619.prototype, "max_surge", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114619.prototype, "max_unavailable", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114619.prototype, "reserve_resources", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114619.prototype, "step_down", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114619.prototype, "strict_in_place", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114619.prototype, "threshold", void 0);
exports.Item114619 = Item114619;
class Item114617 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'name': { required: false, type: () => String }, 'parameters': { required: false, type: () => require("./get-v1-depconf-hierarchy_config_commit-get_info.dto").Item114619 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114617.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114619),
    __metadata("design:type", Item114619)
], Item114617.prototype, "parameters", void 0);
exports.Item114617 = Item114617;
class Item114610 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'name': { required: false, type: () => String }, 'parameters': { required: false, type: () => require("./get-v1-depconf-hierarchy_config_commit-get_info.dto").Item114619 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114610.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114619),
    __metadata("design:type", Item114619)
], Item114610.prototype, "parameters", void 0);
exports.Item114610 = Item114610;
class Item114609 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'assignment_policies': { required: false, type: () => [require("./get-v1-depconf-hierarchy_config_commit-get_info.dto").Item114626] }, 'orchestrator': { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114626),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item114609.prototype, "assignment_policies", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114609.prototype, "orchestrator", void 0);
exports.Item114609 = Item114609;
class Item114608 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'cpu': { required: false, type: () => Number }, 'disk': { required: false, type: () => Number }, 'gpu': { required: false, type: () => Number }, 'mem': { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114608.prototype, "cpu", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114608.prototype, "disk", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114608.prototype, "gpu", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114608.prototype, "mem", void 0);
exports.Item114608 = Item114608;
class Item114606 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'workload_type': { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114606.prototype, "workload_type", void 0);
exports.Item114606 = Item114606;
class Item114604 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'canary_init_count': { required: false, type: () => Number }, 'cluster': { required: false, type: () => String }, 'component_detail': { required: false, type: () => require("./get-v1-depconf-hierarchy_config_commit-get_info.dto").Item114606 }, 'enable_canary': { required: false, type: () => Boolean }, 'replicas': { required: false, type: () => Number }, 'strategy_definition': { required: false, type: () => require("./get-v1-depconf-hierarchy_config_commit-get_info.dto").Item114617 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114604.prototype, "canary_init_count", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114604.prototype, "cluster", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114606),
    __metadata("design:type", Item114606)
], Item114604.prototype, "component_detail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114604.prototype, "enable_canary", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114604.prototype, "replicas", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114617),
    __metadata("design:type", Item114617)
], Item114604.prototype, "strategy_definition", void 0);
exports.Item114604 = Item114604;
class Item114589 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'acl': { required: false, type: () => String }, 'alias': { required: false, type: () => String }, 'dr_cluster': { required: false, type: () => String }, 'dr_data_sync_method': { required: false, type: () => String }, 'dr_enable': { required: false, type: () => Boolean }, 'password': { required: false, type: () => String }, 'users': { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114589.prototype, "acl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114589.prototype, "alias", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114589.prototype, "dr_cluster", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114589.prototype, "dr_data_sync_method", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114589.prototype, "dr_enable", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114589.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114589.prototype, "users", void 0);
exports.Item114589 = Item114589;
class Item114578 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'annotations': { required: false, type: () => require("./index").ItemEmpty }, 'canary_instances': { required: false, type: () => Number }, 'canary_percent': { required: false, type: () => Number }, 'component_detail': { required: false, type: () => require("./get-v1-depconf-hierarchy_config_commit-get_info.dto").Item114606, description: "ECP only fields." }, 'ecp_cluster_configs': { required: false, type: () => [require("./get-v1-depconf-hierarchy_config_commit-get_info.dto").Item114604] }, 'instances': { required: false, type: () => Number }, 'minimum_instances': { required: false, type: () => Number }, 'resources': { required: false, type: () => require("./get-v1-depconf-hierarchy_config_commit-get_info.dto").Item114608 }, 'scheduler': { required: false, type: () => require("./get-v1-depconf-hierarchy_config_commit-get_info.dto").Item114609 }, 'strategy': { required: false, type: () => require("./get-v1-depconf-hierarchy_config_commit-get_info.dto").Item114610 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => _1.ItemEmpty),
    __metadata("design:type", _1.ItemEmpty)
], Item114578.prototype, "annotations", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114578.prototype, "canary_instances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114578.prototype, "canary_percent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114606),
    __metadata("design:type", Item114606)
], Item114578.prototype, "component_detail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114604),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item114578.prototype, "ecp_cluster_configs", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114578.prototype, "instances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114578.prototype, "minimum_instances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114608),
    __metadata("design:type", Item114608)
], Item114578.prototype, "resources", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114609),
    __metadata("design:type", Item114609)
], Item114578.prototype, "scheduler", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114610),
    __metadata("design:type", Item114610)
], Item114578.prototype, "strategy", void 0);
exports.Item114578 = Item114578;
class Item114574 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'az': { required: false, type: () => String }, 'az_v2': { required: false, type: () => String }, 'cid': { required: false, type: () => String }, 'comment': { required: false, type: () => String }, 'created_by': { required: false, type: () => String }, 'created_ts': { required: false, type: () => Number }, 'data': { required: false, type: () => require("./get-v1-depconf-hierarchy_config_commit-get_info.dto").Item114578 }, 'dz_type': { required: false, type: () => String }, 'enabled': { required: false, type: () => Boolean }, 'env': { required: false, type: () => String }, 'id': { required: false, type: () => Number }, 'key_id': { required: false, type: () => Number }, 'key_type': { required: false, type: () => String }, 'level': { required: false, type: () => Number }, 'middleware_data': { required: false, type: () => require("./get-v1-depconf-hierarchy_config_commit-get_info.dto").Item114589 }, 'path': { required: false, type: () => String }, 'project': { required: false, type: () => String }, 'service_meta_type': { required: false, type: () => String }, 'version': { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114574.prototype, "az", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114574.prototype, "az_v2", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114574.prototype, "cid", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114574.prototype, "comment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114574.prototype, "created_by", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114574.prototype, "created_ts", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114578),
    __metadata("design:type", Item114578)
], Item114574.prototype, "data", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114574.prototype, "dz_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114574.prototype, "enabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114574.prototype, "env", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114574.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114574.prototype, "key_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114574.prototype, "key_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114574.prototype, "level", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114589),
    __metadata("design:type", Item114589)
], Item114574.prototype, "middleware_data", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114574.prototype, "path", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114574.prototype, "project", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114574.prototype, "service_meta_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114574.prototype, "version", void 0);
exports.Item114574 = Item114574;
class GetV1DepconfHierarchyConfigCommitGetInfoReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'project': { required: true, type: () => String, description: "Project module name (smm-api). Specify this or service_id" }, 'service_id': { required: true, type: () => String, description: "CMDB Service ID. Specify this or project" }, 'dz_type': { required: true, type: () => String, description: "DEPLOYMENT_ZONE_LOCAL" }, 'level': { required: false, type: () => String, description: "Which level of the hierarchy to return, optional" }, 'next_id': { required: false, type: () => Number, description: "Next paginated id" }, 'limit': { required: false, type: () => Number, description: "How many records to return" }, 'get_children': { required: false, type: () => Boolean, description: "Whether to return descendent levels" } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetV1DepconfHierarchyConfigCommitGetInfoReqDto.prototype, "project", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetV1DepconfHierarchyConfigCommitGetInfoReqDto.prototype, "service_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetV1DepconfHierarchyConfigCommitGetInfoReqDto.prototype, "dz_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetV1DepconfHierarchyConfigCommitGetInfoReqDto.prototype, "level", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetV1DepconfHierarchyConfigCommitGetInfoReqDto.prototype, "next_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetV1DepconfHierarchyConfigCommitGetInfoReqDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetV1DepconfHierarchyConfigCommitGetInfoReqDto.prototype, "get_children", void 0);
exports.GetV1DepconfHierarchyConfigCommitGetInfoReqDto = GetV1DepconfHierarchyConfigCommitGetInfoReqDto;
class GetV1DepconfHierarchyConfigCommitGetInfoResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'commits': { required: false, type: () => [require("./get-v1-depconf-hierarchy_config_commit-get_info.dto").Item114574] }, 'success': { required: true, type: () => Boolean, description: "\u8BF7\u6C42\u4E1A\u52A1\u7ED3\u679C" } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114574),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GetV1DepconfHierarchyConfigCommitGetInfoResDto.prototype, "commits", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetV1DepconfHierarchyConfigCommitGetInfoResDto.prototype, "success", void 0);
exports.GetV1DepconfHierarchyConfigCommitGetInfoResDto = GetV1DepconfHierarchyConfigCommitGetInfoResDto;
//# sourceMappingURL=get-v1-depconf-hierarchy_config_commit-get_info.dto.js.map