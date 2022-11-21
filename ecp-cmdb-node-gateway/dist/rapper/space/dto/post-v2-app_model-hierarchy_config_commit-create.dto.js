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
exports.PostV2AppModelHierarchyConfigCommitCreateResDto = exports.PostV2AppModelHierarchyConfigCommitCreateReqDto = exports.Item114869 = exports.Item114871 = exports.Item114874 = exports.Item114877 = exports.Item114878 = exports.Item114879 = exports.Item114881 = exports.Item114887 = exports.Item114894 = exports.Item114898 = exports.Item114914 = exports.Item114933 = exports.Item114945 = exports.Item114949 = exports.Item114971 = exports.Item114973 = exports.Item114975 = exports.Item114990 = exports.Item114997 = exports.Item115009 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const _1 = require(".");
class Item115009 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'max_instances': { required: false, type: () => Number }, 'selectors': { required: false, type: () => [require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114914] }, 'unique_key': { required: false, type: () => String, description: "Only `agent_id` is supported so far." } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item115009.prototype, "max_instances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114914),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item115009.prototype, "selectors", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item115009.prototype, "unique_key", void 0);
exports.Item115009 = Item115009;
class Item114997 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'name': { required: false, type: () => String }, 'parameters': { required: false, type: () => require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114894 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114997.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114894),
    __metadata("design:type", Item114894)
], Item114997.prototype, "parameters", void 0);
exports.Item114997 = Item114997;
class Item114990 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'name': { required: false, type: () => String }, 'parameters': { required: false, type: () => require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item115009 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114990.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item115009),
    __metadata("design:type", Item115009)
], Item114990.prototype, "parameters", void 0);
exports.Item114990 = Item114990;
class Item114975 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'assignment_policies': { required: false, type: () => [require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114990] }, 'orchestrator': { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114990),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item114975.prototype, "assignment_policies", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114975.prototype, "orchestrator", void 0);
exports.Item114975 = Item114975;
class Item114973 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'name': { required: false, type: () => String }, 'parameters': { required: false, type: () => require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114894 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114973.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114894),
    __metadata("design:type", Item114894)
], Item114973.prototype, "parameters", void 0);
exports.Item114973 = Item114973;
class Item114971 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'canary_init_count': { required: false, type: () => Number }, 'cluster': { required: false, type: () => String }, 'component_detail': { required: false, type: () => require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114871 }, 'enable_canary': { required: false, type: () => Boolean }, 'replicas': { required: false, type: () => Number }, 'strategy_definition': { required: false, type: () => require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114997 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114971.prototype, "canary_init_count", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114971.prototype, "cluster", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114871),
    __metadata("design:type", Item114871)
], Item114971.prototype, "component_detail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114971.prototype, "enable_canary", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114971.prototype, "replicas", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114997),
    __metadata("design:type", Item114997)
], Item114971.prototype, "strategy_definition", void 0);
exports.Item114971 = Item114971;
class Item114949 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'annotations': { required: false, type: () => require("./index").ItemEmpty }, 'canary_instances': { required: false, type: () => Number }, 'canary_percent': { required: false, type: () => Number }, 'component_detail': { required: false, type: () => require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114871, description: "ECP only fields." }, 'ecp_cluster_configs': { required: false, type: () => [require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114971] }, 'instances': { required: false, type: () => Number }, 'minimum_instances': { required: false, type: () => Number }, 'resources': { required: false, type: () => require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114877 }, 'scheduler': { required: false, type: () => require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114975 }, 'strategy': { required: false, type: () => require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114973 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => _1.ItemEmpty),
    __metadata("design:type", _1.ItemEmpty)
], Item114949.prototype, "annotations", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114949.prototype, "canary_instances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114949.prototype, "canary_percent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114871),
    __metadata("design:type", Item114871)
], Item114949.prototype, "component_detail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114971),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item114949.prototype, "ecp_cluster_configs", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114949.prototype, "instances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114949.prototype, "minimum_instances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114877),
    __metadata("design:type", Item114877)
], Item114949.prototype, "resources", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114975),
    __metadata("design:type", Item114975)
], Item114949.prototype, "scheduler", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114973),
    __metadata("design:type", Item114973)
], Item114949.prototype, "strategy", void 0);
exports.Item114949 = Item114949;
class Item114945 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'az': { required: false, type: () => String }, 'az_v2': { required: false, type: () => String }, 'cid': { required: false, type: () => String }, 'comment': { required: false, type: () => String }, 'created_by': { required: false, type: () => String }, 'created_ts': { required: false, type: () => Number }, 'data': { required: false, type: () => require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114949 }, 'dz_type': { required: false, type: () => String }, 'enabled': { required: false, type: () => Boolean }, 'env': { required: false, type: () => String }, 'id': { required: false, type: () => Number }, 'key_id': { required: false, type: () => Number }, 'key_type': { required: false, type: () => String }, 'level': { required: false, type: () => Number }, 'middleware_data': { required: false, type: () => require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114933 }, 'path': { required: false, type: () => String }, 'project': { required: false, type: () => String }, 'service_meta_type': { required: false, type: () => String }, 'version': { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114945.prototype, "az", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114945.prototype, "az_v2", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114945.prototype, "cid", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114945.prototype, "comment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114945.prototype, "created_by", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114945.prototype, "created_ts", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114949),
    __metadata("design:type", Item114949)
], Item114945.prototype, "data", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114945.prototype, "dz_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114945.prototype, "enabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114945.prototype, "env", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114945.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114945.prototype, "key_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114945.prototype, "key_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114945.prototype, "level", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114933),
    __metadata("design:type", Item114933)
], Item114945.prototype, "middleware_data", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114945.prototype, "path", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114945.prototype, "project", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114945.prototype, "service_meta_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114945.prototype, "version", void 0);
exports.Item114945 = Item114945;
class Item114933 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'acl': { required: false, type: () => String }, 'alias': { required: false, type: () => String }, 'dr_cluster': { required: false, type: () => String }, 'dr_data_sync_method': { required: false, type: () => String }, 'dr_enable': { required: false, type: () => Boolean }, 'password': { required: false, type: () => String }, 'users': { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114933.prototype, "acl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114933.prototype, "alias", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114933.prototype, "dr_cluster", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114933.prototype, "dr_data_sync_method", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114933.prototype, "dr_enable", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114933.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114933.prototype, "users", void 0);
exports.Item114933 = Item114933;
class Item114914 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'key': { required: false, type: () => String }, 'operator': { required: false, type: () => String }, 'value': { required: false, type: () => String }, 'values': { required: false, type: () => [Object] } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114914.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114914.prototype, "operator", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114914.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item114914.prototype, "values", void 0);
exports.Item114914 = Item114914;
class Item114898 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'max_instances': { required: false, type: () => Number }, 'selectors': { required: false, type: () => [require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114914] }, 'unique_key': { required: false, type: () => String, description: "Only `agent_id` is supported so far." } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114898.prototype, "max_instances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114914),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item114898.prototype, "selectors", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114898.prototype, "unique_key", void 0);
exports.Item114898 = Item114898;
class Item114894 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'canary_stages': { required: false, type: () => [Object] }, 'disable_restart': { required: false, type: () => Boolean }, 'enable_canary_replacement': { required: false, type: () => Boolean }, 'in_place': { required: false, type: () => Boolean }, 'instances_per_agent': { required: false, type: () => Number }, 'max_surge': { required: false, type: () => String }, 'max_unavailable': { required: false, type: () => String }, 'reserve_resources': { required: false, type: () => Boolean }, 'step_down': { required: false, type: () => Number }, 'strict_in_place': { required: false, type: () => Boolean }, 'threshold': { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item114894.prototype, "canary_stages", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114894.prototype, "disable_restart", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114894.prototype, "enable_canary_replacement", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114894.prototype, "in_place", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114894.prototype, "instances_per_agent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114894.prototype, "max_surge", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114894.prototype, "max_unavailable", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114894.prototype, "reserve_resources", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114894.prototype, "step_down", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114894.prototype, "strict_in_place", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114894.prototype, "threshold", void 0);
exports.Item114894 = Item114894;
class Item114887 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'name': { required: false, type: () => String }, 'parameters': { required: false, type: () => require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114898 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114887.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114898),
    __metadata("design:type", Item114898)
], Item114887.prototype, "parameters", void 0);
exports.Item114887 = Item114887;
class Item114881 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'name': { required: false, type: () => String }, 'parameters': { required: false, type: () => require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114894 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114881.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114894),
    __metadata("design:type", Item114894)
], Item114881.prototype, "parameters", void 0);
exports.Item114881 = Item114881;
class Item114879 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'name': { required: false, type: () => String }, 'parameters': { required: false, type: () => require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114894 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114879.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114894),
    __metadata("design:type", Item114894)
], Item114879.prototype, "parameters", void 0);
exports.Item114879 = Item114879;
class Item114878 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'assignment_policies': { required: false, type: () => [require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114887] }, 'orchestrator': { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114887),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item114878.prototype, "assignment_policies", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114878.prototype, "orchestrator", void 0);
exports.Item114878 = Item114878;
class Item114877 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'cpu': { required: false, type: () => Number }, 'disk': { required: false, type: () => Number }, 'gpu': { required: false, type: () => Number }, 'mem': { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114877.prototype, "cpu", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114877.prototype, "disk", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114877.prototype, "gpu", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114877.prototype, "mem", void 0);
exports.Item114877 = Item114877;
class Item114874 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'canary_init_count': { required: false, type: () => Number }, 'cluster': { required: false, type: () => String }, 'component_detail': { required: false, type: () => require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114871 }, 'enable_canary': { required: false, type: () => Boolean }, 'replicas': { required: false, type: () => Number }, 'strategy_definition': { required: false, type: () => require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114881 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114874.prototype, "canary_init_count", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114874.prototype, "cluster", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114871),
    __metadata("design:type", Item114871)
], Item114874.prototype, "component_detail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114874.prototype, "enable_canary", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114874.prototype, "replicas", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114881),
    __metadata("design:type", Item114881)
], Item114874.prototype, "strategy_definition", void 0);
exports.Item114874 = Item114874;
class Item114871 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'workload_type': { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114871.prototype, "workload_type", void 0);
exports.Item114871 = Item114871;
class Item114869 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'annotations': { required: false, type: () => require("./index").ItemEmpty }, 'canary_instances': { required: false, type: () => Number }, 'canary_percent': { required: false, type: () => Number }, 'component_detail': { required: false, type: () => require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114871, description: "ECP only fields." }, 'ecp_cluster_configs': { required: false, type: () => [require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114874] }, 'instances': { required: false, type: () => Number }, 'minimum_instances': { required: false, type: () => Number }, 'resources': { required: false, type: () => require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114877 }, 'scheduler': { required: false, type: () => require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114878 }, 'strategy': { required: false, type: () => require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114879 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => _1.ItemEmpty),
    __metadata("design:type", _1.ItemEmpty)
], Item114869.prototype, "annotations", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114869.prototype, "canary_instances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114869.prototype, "canary_percent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114871),
    __metadata("design:type", Item114871)
], Item114869.prototype, "component_detail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114874),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item114869.prototype, "ecp_cluster_configs", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114869.prototype, "instances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114869.prototype, "minimum_instances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114877),
    __metadata("design:type", Item114877)
], Item114869.prototype, "resources", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114878),
    __metadata("design:type", Item114878)
], Item114869.prototype, "scheduler", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114879),
    __metadata("design:type", Item114879)
], Item114869.prototype, "strategy", void 0);
exports.Item114869 = Item114869;
class PostV2AppModelHierarchyConfigCommitCreateReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'az': { required: false, type: () => String }, 'az_v2': { required: false, type: () => String }, 'cid': { required: false, type: () => String }, 'comment': { required: false, type: () => String }, 'config': { required: false, type: () => require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114869 }, 'deployment_zone': { required: false, type: () => String }, 'dz_type': { required: true, type: () => String }, 'env': { required: false, type: () => String }, 'level': { required: false, type: () => Number }, 'middleware_config': { required: false, type: () => require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114933 }, 'project': { required: false, type: () => String }, 'service_id': { required: false, type: () => Number }, 'service_meta_type': { required: false, type: () => String }, 'version': { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV2AppModelHierarchyConfigCommitCreateReqDto.prototype, "az", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV2AppModelHierarchyConfigCommitCreateReqDto.prototype, "az_v2", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV2AppModelHierarchyConfigCommitCreateReqDto.prototype, "cid", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV2AppModelHierarchyConfigCommitCreateReqDto.prototype, "comment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114869),
    __metadata("design:type", Item114869)
], PostV2AppModelHierarchyConfigCommitCreateReqDto.prototype, "config", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV2AppModelHierarchyConfigCommitCreateReqDto.prototype, "deployment_zone", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV2AppModelHierarchyConfigCommitCreateReqDto.prototype, "dz_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV2AppModelHierarchyConfigCommitCreateReqDto.prototype, "env", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PostV2AppModelHierarchyConfigCommitCreateReqDto.prototype, "level", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114933),
    __metadata("design:type", Item114933)
], PostV2AppModelHierarchyConfigCommitCreateReqDto.prototype, "middleware_config", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV2AppModelHierarchyConfigCommitCreateReqDto.prototype, "project", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PostV2AppModelHierarchyConfigCommitCreateReqDto.prototype, "service_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV2AppModelHierarchyConfigCommitCreateReqDto.prototype, "service_meta_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PostV2AppModelHierarchyConfigCommitCreateReqDto.prototype, "version", void 0);
exports.PostV2AppModelHierarchyConfigCommitCreateReqDto = PostV2AppModelHierarchyConfigCommitCreateReqDto;
class PostV2AppModelHierarchyConfigCommitCreateResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'commits': { required: false, type: () => [require("./post-v2-app_model-hierarchy_config_commit-create.dto").Item114945] }, 'success': { required: true, type: () => Boolean, description: "\u8BF7\u6C42\u4E1A\u52A1\u7ED3\u679C" } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114945),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], PostV2AppModelHierarchyConfigCommitCreateResDto.prototype, "commits", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PostV2AppModelHierarchyConfigCommitCreateResDto.prototype, "success", void 0);
exports.PostV2AppModelHierarchyConfigCommitCreateResDto = PostV2AppModelHierarchyConfigCommitCreateResDto;
//# sourceMappingURL=post-v2-app_model-hierarchy_config_commit-create.dto.js.map