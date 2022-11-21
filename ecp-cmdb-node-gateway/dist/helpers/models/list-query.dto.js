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
exports.ListQuery = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const error_1 = require("../constants/error");
const exception_1 = require("@infra-node-kit/exception");
const common_1 = require("@nestjs/common");
class ListQuery {
    static parseFilter(filter) {
        const supportedFilterCharacter = /^([a-zA-Z-_.]+)(>|<|<=|>=|==|!=|=@|!@|^=|\$=|=~|!~)([^=]+)$/;
        const match = filter.match(supportedFilterCharacter);
        if (!match) {
            (0, exception_1.throwError)(`unsupported list query: ${filter}`, error_1.ERROR.SYSTEM_ERROR.COMMON.LIST_QUERY_ERROR.code, common_1.HttpStatus.BAD_REQUEST);
        }
        const [_ignored, keyPath, operator, value] = match;
        return {
            keyPath,
            operator,
            value,
        };
    }
    static parseFilterBy(filterBy) {
        if (!(filterBy === null || filterBy === void 0 ? void 0 : filterBy.length)) {
            return undefined;
        }
        const SPLIT_CHAR = {
            AND: ';',
            OR: ',',
        };
        return filterBy.split(SPLIT_CHAR.AND).map((mustCondition) => {
            const optionalConditions = mustCondition.split(SPLIT_CHAR.OR);
            return optionalConditions.map(ListQuery.parseFilter);
        });
    }
    static parseMustFiltersToKeyValuesMap(filterBy) {
        if (!filterBy || filterBy === '') {
            return {};
        }
        const map = {};
        const items = filterBy.split(';');
        items.forEach((item) => {
            const subItems = item.split(',');
            subItems.forEach((subItem) => {
                const { keyPath, value } = this.parseFilter(subItem);
                if (map[keyPath]) {
                    map[keyPath].push(value);
                }
                else {
                    map[keyPath] = [value];
                }
            });
        });
        return map;
    }
    static convertOrderByWithDot(orderBy) {
        if (!orderBy) {
            return undefined;
        }
        if (/^[\w$_.]+( desc)$/.test(orderBy)) {
            return orderBy.replace(' ', '.');
        }
        return `${orderBy}.asc`;
    }
    static getSearchData(searchBy, sources = []) {
        if (!searchBy) {
            return sources;
        }
        const { keyPath, value } = searchBy;
        const searchRegexp = new RegExp(`.*${value}.*`);
        return sources.filter((item) => {
            const value = this.getSourceValue(keyPath, item);
            if (typeof value !== 'number' && typeof value !== 'string')
                return false;
            return searchRegexp.test(value.toString());
        });
    }
    static getFilteredData(mustItems, sources = []) {
        if (!mustItems) {
            return sources;
        }
        return sources.filter((source) => mustItems.every((mustItem) => mustItem.some((optionalItem) => ListQuery.matchOptionalCondition(source, optionalItem))));
    }
    static isStringArray(array) {
        return typeof array[0] === 'string';
    }
    static matchOptionalCondition(source, optionalItem) {
        const { keyPath, operator, value } = optionalItem;
        const sourceValue = this.getSourceValue(keyPath, source);
        if (Array.isArray(sourceValue) && !ListQuery.isStringArray(sourceValue)) {
            return false;
        }
        if (Array.isArray(sourceValue) || (typeof sourceValue === 'string' && operator === '=@')) {
            return sourceValue.indexOf(value) > -1;
        }
        if (typeof sourceValue === 'string' || typeof sourceValue === 'number') {
            return sourceValue === value;
        }
        return false;
    }
    static getCompareFunction(orderBy) {
        const [keyPath, desc] = orderBy.split(' ');
        return (left, right) => {
            const leftValue = this.getSourceValue(keyPath, left);
            const rightValue = this.getSourceValue(keyPath, right);
            if (leftValue < rightValue) {
                return desc ? 1 : -1;
            }
            return desc ? -1 : 1;
        };
    }
    static getSourceValue(keyPath, source) {
        const pathArray = keyPath.split('.');
        return pathArray.reduce((accumulator, current) => {
            if (typeof accumulator !== 'object' || Array.isArray(accumulator)) {
                return accumulator;
            }
            return accumulator[current];
        }, source);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { offset: { required: false, type: () => Number }, limit: { required: false, type: () => Number }, orderBy: { required: false, type: () => String, pattern: /^[\w$_.]+( desc)?$/ }, filterBy: { required: false, type: () => String }, searchBy: { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ListQuery.prototype, "offset", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ListQuery.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[\w$_.]+( desc)?$/),
    __metadata("design:type", String)
], ListQuery.prototype, "orderBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListQuery.prototype, "filterBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListQuery.prototype, "searchBy", void 0);
exports.ListQuery = ListQuery;
//# sourceMappingURL=list-query.dto.js.map