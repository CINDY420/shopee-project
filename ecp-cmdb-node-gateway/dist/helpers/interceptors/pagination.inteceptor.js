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
exports.PaginateInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const core_1 = require("@nestjs/core");
const list_query_dto_1 = require("../models/list-query.dto");
let PaginateInterceptor = class PaginateInterceptor {
    constructor(reflector) {
        this.reflector = reflector;
    }
    intercept(context, next) {
        var _a;
        const paginationContext = this.reflector.get('pagination', context.getHandler());
        const { key, countKey, defaultOrder, canPaginationFilter, canPaginationSearch, operationAfterInterceptor, } = paginationContext;
        const query = context.switchToHttp().getRequest().query;
        const { filterBy, searchBy, offset = 0, limit = 10 } = query;
        const orderBy = (_a = query.orderBy) !== null && _a !== void 0 ? _a : defaultOrder;
        const filterList = list_query_dto_1.ListQuery.parseFilterBy(filterBy);
        return next.handle().pipe((0, operators_1.map)((data) => {
            const sources = data[key];
            const total = data[countKey];
            if (!searchBy || !canPaginationSearch) {
                return Object.assign(Object.assign({}, data), { [key]: sources, [countKey]: total });
            }
            const searchByList = list_query_dto_1.ListQuery.parseFilter(searchBy);
            const newSources = list_query_dto_1.ListQuery.getSearchData(searchByList, sources);
            return Object.assign(Object.assign({}, data), { [key]: newSources, [countKey]: newSources.length });
        }), (0, operators_1.map)((data) => {
            const sources = data[key];
            const total = data[countKey];
            if (!canPaginationFilter) {
                return Object.assign(Object.assign({}, data), { [key]: sources, [countKey]: total });
            }
            const newSources = list_query_dto_1.ListQuery.getFilteredData(filterList, sources);
            return Object.assign(Object.assign({}, data), { [key]: newSources, [countKey]: newSources.length });
        }), (0, operators_1.map)((data) => {
            const sources = data[key];
            const newSources = orderBy ? sources.sort(list_query_dto_1.ListQuery.getCompareFunction(orderBy)) : sources;
            return Object.assign(Object.assign({}, data), { [key]: newSources });
        }), (0, operators_1.map)((data) => {
            if (operationAfterInterceptor) {
                const extraProps = operationAfterInterceptor(data);
                return Object.assign(Object.assign({}, data), extraProps);
            }
            return data;
        }), (0, operators_1.map)((data) => {
            const sources = data[key];
            const start = offset;
            const end = Number(start) + Number(limit);
            const newSources = sources.slice(start, end);
            return Object.assign(Object.assign({}, data), { [key]: newSources });
        }));
    }
};
PaginateInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], PaginateInterceptor);
exports.PaginateInterceptor = PaginateInterceptor;
//# sourceMappingURL=pagination.inteceptor.js.map