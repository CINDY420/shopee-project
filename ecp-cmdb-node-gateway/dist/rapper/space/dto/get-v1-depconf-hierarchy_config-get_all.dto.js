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
exports.GetV1DepconfHierarchyConfigGetAllResDto = exports.GetV1DepconfHierarchyConfigGetAllReqDto = exports.Item114134 = exports.Item114144 = exports.Item114152 = exports.Item114153 = exports.Item114162 = exports.Item114163 = exports.Item114164 = exports.Item114168 = exports.Item114170 = exports.Item114190 = exports.Item114194 = exports.Item114195 = exports.Item114212 = exports.Item114224 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const _1 = require(".");
class Item114224 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'key': { required: false, type: () => String }, 'operator': { required: false, type: () => String }, 'value': { required: false, type: () => String }, 'values': { required: false, type: () => [Object] } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114224.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114224.prototype, "operator", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114224.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item114224.prototype, "values", void 0);
exports.Item114224 = Item114224;
class Item114212 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'max_instances': { required: false, type: () => Number }, 'selectors': { required: false, type: () => [require("./get-v1-depconf-hierarchy_config-get_all.dto").Item114224] }, 'unique_key': { required: false, type: () => String, description: "Only `agent_id` is supported so far." } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114212.prototype, "max_instances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114224),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item114212.prototype, "selectors", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114212.prototype, "unique_key", void 0);
exports.Item114212 = Item114212;
class Item114195 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'name': { required: false, type: () => String }, 'parameters': { required: false, type: () => require("./get-v1-depconf-hierarchy_config-get_all.dto").Item114212 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114195.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114212),
    __metadata("design:type", Item114212)
], Item114195.prototype, "parameters", void 0);
exports.Item114195 = Item114195;
class Item114194 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'canary_stages': { required: false, type: () => [Object] }, 'disable_restart': { required: false, type: () => Boolean }, 'enable_canary_replacement': { required: false, type: () => Boolean }, 'in_place': { required: false, type: () => Boolean }, 'instances_per_agent': { required: false, type: () => Number }, 'max_surge': { required: false, type: () => String }, 'max_unavailable': { required: false, type: () => String }, 'reserve_resources': { required: false, type: () => Boolean }, 'step_down': { required: false, type: () => Number }, 'strict_in_place': { required: false, type: () => Boolean }, 'threshold': { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item114194.prototype, "canary_stages", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114194.prototype, "disable_restart", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114194.prototype, "enable_canary_replacement", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114194.prototype, "in_place", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114194.prototype, "instances_per_agent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114194.prototype, "max_surge", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114194.prototype, "max_unavailable", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114194.prototype, "reserve_resources", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114194.prototype, "step_down", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114194.prototype, "strict_in_place", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114194.prototype, "threshold", void 0);
exports.Item114194 = Item114194;
class Item114190 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'name': { required: false, type: () => String }, 'parameters': { required: false, type: () => require("./get-v1-depconf-hierarchy_config-get_all.dto").Item114194 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114190.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114194),
    __metadata("design:type", Item114194)
], Item114190.prototype, "parameters", void 0);
exports.Item114190 = Item114190;
class Item114170 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'assignment_policies': { required: false, type: () => [require("./get-v1-depconf-hierarchy_config-get_all.dto").Item114195] }, 'orchestrator': { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114195),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item114170.prototype, "assignment_policies", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114170.prototype, "orchestrator", void 0);
exports.Item114170 = Item114170;
class Item114168 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'workload_type': { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114168.prototype, "workload_type", void 0);
exports.Item114168 = Item114168;
class Item114164 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'name': { required: false, type: () => String }, 'parameters': { required: false, type: () => require("./get-v1-depconf-hierarchy_config-get_all.dto").Item114194 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114164.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114194),
    __metadata("design:type", Item114194)
], Item114164.prototype, "parameters", void 0);
exports.Item114164 = Item114164;
class Item114163 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'cpu': { required: false, type: () => Number }, 'disk': { required: false, type: () => Number }, 'gpu': { required: false, type: () => Number }, 'mem': { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114163.prototype, "cpu", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114163.prototype, "disk", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114163.prototype, "gpu", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114163.prototype, "mem", void 0);
exports.Item114163 = Item114163;
class Item114162 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'canary_init_count': { required: false, type: () => Number }, 'cluster': { required: false, type: () => String }, 'component_detail': { required: false, type: () => require("./get-v1-depconf-hierarchy_config-get_all.dto").Item114168 }, 'enable_canary': { required: false, type: () => Boolean }, 'replicas': { required: false, type: () => Number }, 'strategy_definition': { required: false, type: () => require("./get-v1-depconf-hierarchy_config-get_all.dto").Item114190 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114162.prototype, "canary_init_count", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114162.prototype, "cluster", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114168),
    __metadata("design:type", Item114168)
], Item114162.prototype, "component_detail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114162.prototype, "enable_canary", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114162.prototype, "replicas", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114190),
    __metadata("design:type", Item114190)
], Item114162.prototype, "strategy_definition", void 0);
exports.Item114162 = Item114162;
class Item114153 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'has_next': { required: false, type: () => Boolean }, 'next_id': { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114153.prototype, "has_next", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114153.prototype, "next_id", void 0);
exports.Item114153 = Item114153;
class Item114152 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'acl': { required: false, type: () => String }, 'alias': { required: false, type: () => String }, 'dr_cluster': { required: false, type: () => String }, 'dr_data_sync_method': { required: false, type: () => String }, 'dr_enable': { required: false, type: () => Boolean }, 'password': { required: false, type: () => String }, 'users': { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114152.prototype, "acl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114152.prototype, "alias", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114152.prototype, "dr_cluster", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114152.prototype, "dr_data_sync_method", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114152.prototype, "dr_enable", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114152.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114152.prototype, "users", void 0);
exports.Item114152 = Item114152;
class Item114144 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'annotations': { required: false, type: () => require("./index").ItemEmpty }, 'canary_instances': { required: false, type: () => Number }, 'canary_percent': { required: false, type: () => Number }, 'component_detail': { required: false, type: () => require("./get-v1-depconf-hierarchy_config-get_all.dto").Item114168, description: "ECP only fields." }, 'ecp_cluster_configs': { required: false, type: () => [require("./get-v1-depconf-hierarchy_config-get_all.dto").Item114162] }, 'instances': { required: false, type: () => Number }, 'minimum_instances': { required: false, type: () => Number }, 'resources': { required: false, type: () => require("./get-v1-depconf-hierarchy_config-get_all.dto").Item114163 }, 'scheduler': { required: false, type: () => require("./get-v1-depconf-hierarchy_config-get_all.dto").Item114170 }, 'strategy': { required: false, type: () => require("./get-v1-depconf-hierarchy_config-get_all.dto").Item114164 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => _1.ItemEmpty),
    __metadata("design:type", _1.ItemEmpty)
], Item114144.prototype, "annotations", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114144.prototype, "canary_instances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114144.prototype, "canary_percent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114168),
    __metadata("design:type", Item114168)
], Item114144.prototype, "component_detail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114162),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item114144.prototype, "ecp_cluster_configs", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114144.prototype, "instances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114144.prototype, "minimum_instances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114163),
    __metadata("design:type", Item114163)
], Item114144.prototype, "resources", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114170),
    __metadata("design:type", Item114170)
], Item114144.prototype, "scheduler", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114164),
    __metadata("design:type", Item114164)
], Item114144.prototype, "strategy", void 0);
exports.Item114144 = Item114144;
class Item114134 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'az': { required: false, type: () => String }, 'az_v2': { required: false, type: () => String }, 'cid': { required: false, type: () => String }, 'comment': { required: false, type: () => String }, 'created_by': { required: false, type: () => String }, 'created_ts': { required: false, type: () => Number }, 'data': { required: false, type: () => require("./get-v1-depconf-hierarchy_config-get_all.dto").Item114144 }, 'deleted_ts': { required: false, type: () => Number }, 'deployment_zone': { required: false, type: () => String }, 'dz_id': { required: false, type: () => Number }, 'dz_type': { required: false, type: () => String }, 'enabled': { required: false, type: () => Boolean }, 'env': { required: false, type: () => String }, 'id': { required: false, type: () => Number }, 'key_id': { required: false, type: () => Number }, 'key_type': { required: false, type: () => String }, 'level': { required: false, type: () => Number }, 'middleware_data': { required: false, type: () => require("./get-v1-depconf-hierarchy_config-get_all.dto").Item114152 }, 'path': { required: false, type: () => String }, 'path_names': { required: false, type: () => [Object] }, 'project': { required: false, type: () => String }, 'service_id': { required: false, type: () => Number }, 'service_meta_type': { required: false, type: () => String }, 'updated_ts': { required: false, type: () => Number }, 'version': { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114134.prototype, "az", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114134.prototype, "az_v2", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114134.prototype, "cid", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114134.prototype, "comment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114134.prototype, "created_by", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114134.prototype, "created_ts", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114144),
    __metadata("design:type", Item114144)
], Item114134.prototype, "data", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114134.prototype, "deleted_ts", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114134.prototype, "deployment_zone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114134.prototype, "dz_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114134.prototype, "dz_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114134.prototype, "enabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114134.prototype, "env", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114134.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114134.prototype, "key_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114134.prototype, "key_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114134.prototype, "level", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114152),
    __metadata("design:type", Item114152)
], Item114134.prototype, "middleware_data", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114134.prototype, "path", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item114134.prototype, "path_names", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114134.prototype, "project", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114134.prototype, "service_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114134.prototype, "service_meta_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114134.prototype, "updated_ts", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114134.prototype, "version", void 0);
exports.Item114134 = Item114134;
class GetV1DepconfHierarchyConfigGetAllReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.GetV1DepconfHierarchyConfigGetAllReqDto = GetV1DepconfHierarchyConfigGetAllReqDto;
class GetV1DepconfHierarchyConfigGetAllResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'configs': { required: false, type: () => [require("./get-v1-depconf-hierarchy_config-get_all.dto").Item114134] }, 'meta': { required: false, type: () => require("./get-v1-depconf-hierarchy_config-get_all.dto").Item114153 }, 'success': { required: true, type: () => Boolean, description: "\u8BF7\u6C42\u4E1A\u52A1\u7ED3\u679C" }, 'total_count': { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114134),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GetV1DepconfHierarchyConfigGetAllResDto.prototype, "configs", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114153),
    __metadata("design:type", Item114153)
], GetV1DepconfHierarchyConfigGetAllResDto.prototype, "meta", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetV1DepconfHierarchyConfigGetAllResDto.prototype, "success", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetV1DepconfHierarchyConfigGetAllResDto.prototype, "total_count", void 0);
exports.GetV1DepconfHierarchyConfigGetAllResDto = GetV1DepconfHierarchyConfigGetAllResDto;
//# sourceMappingURL=get-v1-depconf-hierarchy_config-get_all.dto.js.map