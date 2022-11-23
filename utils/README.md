# @infra/utils

## Table of Contents

- [Usage](#usage)
  - [1. tryCatch](#1-trycatch)
  - [2. listQuery](#2-listquery)
    - [2.1 Build in Frontend](#21-build-in-frontend)
    - [2.2 Parse in Bff](#22-parse-in-bff)
  - [3. pageInMemory](#3-pageinmemory)
    - [3.1 page once](#31-page-once)
    - [3.2 page separately](#32-page-separately)

## Usage

### 1. tryCatch

``` typescript
import { tryCatch } from '@infra/utils'

const [response, error] = await tryCatch(listClustersFn())
if (error) {
  console.error('error:', error)
}
```

### 2. listQuery

#### 2.1 Build in Frontend

- build filterBy

``` typescript
import { listQuery } from '@infra/utils'

const { FilterByOperator, FilterByBuilder } = listQuery

const mockFilterItems = [
  { keyPath: 'name', operator: FilterByOperator.EQUAL, value: 'jack' },
  { keyPath: 'age', operator: FilterByOperator.GREATER_THAN, value: '13' },
  { keyPath: 'name', operator: FilterByOperator.EQUAL, value: 'mary' },
]

const filterBy = new FilterByBuilder(mockFilterItems)
filterBy.append({ keyPath: 'age', operator: FilterByOperator.LESS_THAN, value: '50' })
const filterString = filterBy.build()
console.log('filterString:', filterString)
// filterString: 'name==jack,name==mary;age>13,age<50'
```

- build orderBy

``` typescript
import { listQuery } from '@infra/utils'
const { buildOrderBy } = listQuery

const mockOrderBy = { keyPath: 'time', order: listQuery.ORDER.ASCEND }
const buildedOrderBy = buildOrderBy(mockOrderBy)
console.log('buildedOrderBy:', buildedOrderBy)
// buildedOrderBy: 'time ascend'
```

- transform pagination to offset and limit

``` typescript
import { listQuery } from '@infra/utils'
const { paginationToOffsetLimit } = listQuery

const { offset, limit } = paginationToOffsetLimit({ currentPage: 100, pageSize: 10 })
console.log('offset:', offset)
console.log('limit:', limit)
// offset: 990
// limit: 10
```

#### 2.2 Parse in Bff

- parse filterBy

``` typescript
import { listQuery } from '@infra/utils'
const { FilterByParser, FilterByOperator } = listQuery

const mockFilterBy = 'name==jack,name==mary;age>13'
const filterByParser = new FilterByParser(mockFilterBy)
const parsedFilterItems = filterByParser.parse()
console.log('parsedFilterItems:', parsedFilterItems)
/*
  * parsedFilterItems: [
  *   { keyPath: 'name', operator: '==', value: 'jack' },
  *   { keyPath: 'name', operator: '==', value: 'mary' },
  *   { keyPath: 'age', operator: '>', value: '13' }
  * ]
  */
const equalKeyPathValuesMap = filterByParser.parseByOperator(FilterByOperator.EQUAL)
console.log('equalKeyPathValuesMap:', equalKeyPathValuesMap)
//equalKeyPathValuesMap: { name: [ 'jack', 'mary' ] }
const nameOperatorValuesMap = filterByParser.parseByKeyPath('name')
console.log('nameOperatorValuesMap:', nameOperatorValuesMap)
// nameOperatorValuesMap: { '==': [ 'jack', 'mary' ] }
```

- parse orderBy

``` typescript
import { listQuery } from '@infra/utils'
const { parseOrderBy } = listQuery

const mockBuildedOrderBy = 'time ascend'
const parsedOrderBy = parseOrderBy(mockBuildedOrderBy)
console.log('parsedOrderBy:', parsedOrderBy)
// parsedOrderBy: { keyPath: 'time', order: 'ascend' }
```

- transform offset and limit to pagination

``` typescript
import { listQuery } from '@infra/utils'
const { offsetLimitToPagination } = listQuery

const { currentPage, pageSize } = offsetLimitToPagination({ offset: 990, limit: 10 })
console.log('currentPage:', currentPage)
console.log('pageSize:', pageSize)
// currentPage: 100
// pageSize: 10
```

### 3. pageInMemory

#### 3.1 page once

`pageByQuery` method will integrate filter, sort and paginate for you to page your items by query, you only need to call it once. Refer to the following  usage:

``` typescript
import { pageInMemory, listQuery } from '@infra/utils'
const { ORDER } = listQuery
const { pageByQuery } = pageInMemory

const mockItems = [
  { name: 'lily', age: 13, country: 'China' },
  { name: 'jack', age: 30, country: 'USA' },
  { name: 'mary', age: 25, country: 'USA' },
  { name: 'kangkang', age: 10, country: 'USA' },
  { name: 'lisi', age: 30, country: 'USA' },
  { name: 'mark', age: 44, country: 'China' },
]
const mockQuery = {
  offset: 1,
  limit: 3,
  filterBy: 'country==USA;age>10',
  orderBy: `name ${ORDER.DESCEND}`,
}
const { items: pagedItems, total } = pageByQuery({ items: mockItems, query: mockQuery })
console.log('pagedItems:', pagedItems)
console.log('total:', total)
/*
 * pagedItems: [
 *   { name: 'lisi', age: 30, country: 'USA' },
 *   { name: 'jack', age: 30, country: 'USA' }
 * ]
 * total: 3
 */
```

#### 3.2 page separately

Also, you can filter, sort and paginate your items separately if you have other needs:

``` typescript
import { listQuery, pageInMemory } from '@infra/utils'
const { FilterByParser, parseOrderBy } = listQuery
const { filter, sort, paginate } = pageInMemory

const { offset = 0, limit = 10, filterBy = '', orderBy = '' } = query

// filter
const filterByParser = new FilterByParser(filterBy)
const filterByItems = filterByParser.parse()
const filteredItems = filter({ items, filterByItems })

// sort
const parsedOrderBy = parseOrderBy(orderBy)
const sortedItems = parsedOrderBy
  ? sort({ items: filteredItems, orderBy: parsedOrderBy })
  : filteredItems

// paginate
const paginatedItems = paginate({ items: sortedItems, offset, limit })
```
