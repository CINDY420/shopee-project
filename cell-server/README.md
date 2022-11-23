[toc]

# Cell Server

Cell is a FaaS-like platform for BFF application

## 安装

```bash
$ yarn --frozen-lockfile
```

## 开发/运行

```bash
# 本地开发
$ yarn dev
# or
$ yarn start:debug

# 线上运行
$ yarn start:prod
```

## 测试

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## 目录结构

```bash
.
└── src
    ├── common
    │   ├── constants             # 包含所有常量、常量表、枚举、字面量枚举
    │   ├── decorators            # 自定装饰器       https://docs.nestjs.com/custom-decorators
    │   ├── exception-filters     # NestJS错误处理器 https://docs.nestjs.com/exception-filters
    │   ├── guards                # NestJS守卫      https://docs.nestjs.com/guards
    │   ├── interceptors          # NestJS请求拦截器 https://docs.nestjs.com/interceptors
    │   ├── middlewares           # NestJS请求中间件 https://docs.nestjs.com/middleware
    │   ├── models                # 公共的数据模型、DTO
    │   ├── pipes                 # Nest管道         https://docs.nestjs.com/pipes
    │   └── utils                 # 公共工具类
    ├── configs                   # 配置文件
    ├── features                  # 业务相关模块及单测 https://docs.nestjs.com/modules
    ├── shared                    # 共享的Service和Module
    └── test                      # e2e测试
```

## 说明

### ESlint规范

本规范基于 [ Style Guides ](https://shopee.git-pages.garena.com/isfe/DSFE/style-guides/) 标准，其中需要注意的一般有

1. 不能有隐式的 `any`

2. 不能使用 ` @ts-ignore ` ，应当使用TS3.9之后引入的 `@ts-expect-error`，并且强制要求后面跟一段注释，说明一下这里预期就是TS报错的原因

   这样的话，等到以后该原因如果被修复，则这里的 `@ts-expect-error` 将会报一个 不必要的注释 的错，督促开发者去除此注释，恢复这里的类型检查

3. 符号命名规则

   1. 所有符号：不以$ _开头结尾
   2. 变量、参数、函数成员变量、方法名：使用驼峰或者全大写+下划线命名 如 `badApple` 或者 `BAD_APPLE`
   3. 布尔型变量：必须以`is` `should` `has` `can` `did` `will`开头 如 `isGood` `IS_GOOD`
   4. 数组型变量：必须以`s` `List` `Array`结尾 如`strings` `stringList` `stringArray`
   5. 类型、类、接口：禁止以I开头+帕斯卡，只使用帕斯卡命名法 如 `Person`
   6. 枚举成员：全大写+下划线命名 如`A_B_C`
   7. 泛型：T开头，后面跟帕斯卡命名法，如`TResult`

4. 不能使用`console`，而应当使用`nest`的`logger`

5. 函数 [圈复杂度](https://zh.wikipedia.org/wiki/%E5%BE%AA%E7%92%B0%E8%A4%87%E9%9B%9C%E5%BA%A6) 不能超过15，如超过，可以使用分支配置表、抽函数等方法解决

### CommitLint 规范

1. 基于 `Angular` 提交信息规范[¶](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit-message-header)
2. `scope` 部分必须使用驼峰

### TS配置

1. 配置路径别名，`@` 代表 `src` 目录
2. 开启严格模式，可以更精准地推断

### HTTP客户端

1. 内置一个 `HTTP` 客户端，基于 [GotJS](https://github.com/sindresorhus/got) 实现了 `GET` `POST` `PUT` `DELETE` 方法和下载文件方法，并且自带重试逻辑
2. 使用方法：构造函数里 `Inject` 引入
3. `GET` `POST` `PUT` `DELETE` 方法
   1. 第一个泛型参数指明返回体类型，第二个指明请求体类型
   2. 第一个参数是 `URL`，第二个参数是 `data`，第三个参数是 `Got` 的配置
4. `downloadFile` 方法：提供重命名、自动创建目标存放文件夹、覆盖文件、下载进度日志打印功能

### 错误过滤

本项目将项目错误分为三类

1. `Nest` 内置的 `HttpException`，许多内置校验会报此类错误，在 `HttpExceptionFilter` 内处理，`code` 统一为-1，`http` 状态码根据实际错误赋值
2. 业务自定义抛错，在 `CustomExceptionFilter` 处理，业务可以使用 `throwError` 方法抛出的 `CustomException`，支持手动指明 `message`，`code ` 和 `http` 状态码，也可以先在错误表`(src/common/constants/error.ts)` 内定义错误，然后把定好的错误作为参数
3. 其他内部错误，在 `UnknownExceptionFilter` 类兜底处理，`code` 统一为 `-1`，`http` 状态码统一为 500，后续应该在此处做上报和告警

### 测试

本项目有两类测试，可以参考样例代码编写

1. 单元测试，放置在目标单测文件的同一目录，使用 `jest` 和 `@nestjs/testing` 库测试
2. `e2e `测试，放置在 `src/test` 下，使用 `supertest` + `jest` 库测试

### 日志系统

1. 基于 `winston` 和 `NestJS` 的 `ConsoleLogger` 类开发，使用 `asynchooks` 技术（@medibloc/nestjs-request-context模块）将单次请求上下文的全部日志用requestId聚合

2. 使用方法：

   1. `Nest ` 的 `Module`、`service` 内可以依赖注入 `logger`，然后执行 `logger.setContext` 写入 `label` 值
   2. 在无法依赖注入的地方，可以用 `new Logger` 来获取 `logger` 实例

3. 效果：日志将会在两个地方输出

   1. 控制台，如图：

      ![image](https://confluence.shopee.io/download/attachments/788281456/image2021-11-5_16-20-10.png?version=1&modificationDate=1636100410800&api=v2)

   2. 日志文件：如图  (经过了格式化)

      ![image](https://confluence.shopee.io/download/attachments/788281456/image2021-11-5_16-42-4.png?version=1&modificationDate=1636101725076&api=v2)

      可以看到 同个请求的 `requestId` 是一样的，而 `label` 就是 `logger.setContext` 时传入的参数

      这样在日志平台可以方便地搜索

      ![image](https://confluence.shopee.io/download/attachments/788281456/image2021-11-5_16-46-51.png?version=1&modificationDate=1636102012318&api=v2)

4. 日志平台接入

   1. 阅读[接入文档](https://confluence.shopee.io/display/LOG/Quick+Start#)

      + 需要注意的是 文档里这句

        `如果您的服务运行在容器平台（比如Bromo或深圳K8S），您位于容器"/workspace/log/"的日志已经被映到在宿主机的"/data/log/{your-app-deploy-name}/"了。这就是合法的“binding path”`

        实测没有生效，仍在需要在本说明的第3步中手动配置映射

   2. 以测试环境为例 先在 [ske这个project](https://log.test.shopee.io/platform-management/business-groups/sz-infra/projects/ske?searchValue=ske) 下点击 `Add Logstore` 创建一个 `Logstore` 并找 `SRE` 审批

      ![image](https://confluence.shopee.io/download/attachments/788281456/image2021-11-5_16-52-53.png?version=1&modificationDate=1636102373423&api=v2)

      其中JSON解析规则(Extractor Pattern)可以看 [这个文档](https://confluence.shopee.io/display/LOG/Extractor+Pattern+Design) 配置

   3. 在第2步中自动生成的 `Path Pattern` ，如截图中的`/data/log/ske-test-test-sg/*/`，日志平台将会自动从 `Pod` 所在 `Nodes` 的这个地址收集日志，因此我们需要配置 `deployment` 的 `volumeMounts`，如图（可以参考 `deployment/deployment.yaml`)

      ![img](https://confluence.shopee.io/download/attachments/788281456/image2021-11-5_16-56-47.png?version=1&modificationDate=1636102607456&api=v2)

      其中 `/workspace/log` 是本项目模板在生产环境下存放日志的目录

   4. 成功部署上去之后，就可以看日志了

### 监控系统

1. 基于 [prometheus](https://prometheus.io/) 和 [prom-client](https://github.com/siimon/prom-client) 接入了公司的监控
2. nest启动的时候同时监听两个端口，其中2020端口是监控数据结果查询用的端口
3. [接入文档](https://confluence.shopee.io/display/MPUC/Quick+Start)
4. 接入步骤：
   1. [先创建一个MetricStore](https://monitoring.infra.sz.shopee.io/collecting/metric-stores?metric-store=%5B%5B%22Application%20Infra%22%5D%2C%5B%22kubernetes-platform%22%5D%5D&page-number=1&page-size=10) （如果已经有了，可以用已有的）
   2. 创建好的MetricStore类似于 [这样](https://monitoring.infra.sz.shopee.io/collecting/metric-stores/node-bff-template-demo?task-page-number=1&task-page-size=10) ，此时可以点击 Add Task 创建一个 Task
   3. 创建好的Task类似于 [这样](https://monitoring.infra.sz.shopee.io/collecting/metric-stores/node-bff-template-demo/tasks/node-bff-template-demo-task?page-number=1&page-size=10) ，然后切到 Details 的 config 这个 tab，点击 edit 编辑
   4. 配置可以参考 `deployment/monitoring-task-config.yaml` 将参数替换一下即可
   5. 然后可以看一下 [target里的信息](https://monitoring.infra.sz.shopee.io/platform/targets) ，先搜索task，得到类似 [这样](https://monitoring.infra.sz.shopee.io/platform/targets?platform-cluster-name=%22sg-nonlive%22&platform-store-id=%22330%22&platform-store-name=%22node-bff-template-demo%22) 的页面，看一下 State 是不是 up，如果出现没有 up，且Error是连接超时，则说明有网络策略问题导致网络不通，可提单给监控平台的SRE
   6. target up之后可以在 [MetricStore页面](https://monitoring.infra.sz.shopee.io/collecting/metric-stores/node-bff-template-demo?task-page-number=1&task-page-size=10) ，切到 Metric List 这个tab，点击链接到 grafana 平台去看数据是否正常，比如可以执行查询 `nodejs_version_info` 看看是否有结果
   7. 以上步骤都OK的话，就可以按照接入文档去创建 Grafana 页面，自定义一些指标了

### 其他

#### try-catch

这里说明一下 `utils/try-catch.ts` 的使用，此函数封装 js 内置的 try catch 语句块，旨在带来以下好处

1. 作用域统一

```js
// 以下写法将产生三块作用域：try内，catch内和try catch的上级作用域，这会产生一些不方便：
// 在catch作用域内要访问try内计算所得的变量cost的话，需要将cost以let的形式挪到上级作用域，这不符合prefer const原则
const var1 = 0
try {
  const timeStart = Date.now()
  const result = await promise
  const timeEnd = Date.now()
  const cost = timeEnd - timeStart
  console.log('xxx', cost)
} catch (e) {
  console.log('yyy', cost) // cost is not defined in fact
  console.error(e)
}

// 使用try-catch后
const timeStart = Date.now()
const [result, error] = await tryCatch(promise)
const timeEnd = Date.now()
const cost = timeEnd - timeStart
if (error) {
  console.log('yyy', cost)
  console.error(e)
}
if (result) {
  // access result safely
  console.log('xxx', cost)
  const b = result.c
}
```

2. 有时候不需要关心result或者err一个时，只需解构时忽略其中一个

```js
const [result] = await tryCatch(promise)
const [, error] = await tryCatch(promise)

// 当然普通try catch语句块也可以做到，但是写法有点冗长
```

3. 和 `async/await` 对回调的作用一样，可以解决 `try catch` 地狱问题，对需要对多过程不同 `error` 进行不同或者相同处理的场景也有作用

``` js
const [result1, error1] = await tryCatch(promise1)
if (error1) {
  // do something
  return
}
const [result2, error2] = await tryCatch(getPromise2(result1))
if (error2) {
  // do something
  return
}
const [result3, error3] = await tryCatch(getPromise3(result2))
if (error3) {
  // do something
  return
}
return result3
```

4. 业界类似实践：
   1. Go里对result和error的处理风格与此函数类似
   2. npm包 [await-to-js](https://www.npmjs.com/package/await-to-js) 就是此函数的一种类似实现，还有类似的 [await-of](https://github.com/xobotyi/await-of)

#### ping-pong

内置了一个 `ping` 模块，提供了一个 `ping`  接口

顾名思义，这是个心跳接口，将返回 `{ pong: %timestamp }`

可以用于存活检查，也可以根据需要在此接口返回一些环境变量，方便校验
