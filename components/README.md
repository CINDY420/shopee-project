# Getting Started

`@infra/components` is a React Components Library based on [Infrad](https://bolifestudio.com/index-cn), it integrates complex components of `infrad` into simple ones, which can be used in an easy way.

[Document Online](https://shopee.git-pages.garena.com/sz-devops/fe/kubernetes/components)

## Install

```bash
yarn add @infra/components
```

`@infra/components` has some peer dependencies, you must make sure you have installed them in your project before using, and the needed version of them are:
|  peer dependencies   | needed version  |
|  ----  | ----  |
| infra-design-icons  | >=4.7.14 |
| infrad  | >=4.21.1 |
| react  | >=17.0.0 |
| react-dom  | >=17.0.0 |
| react-router-dom | >=5.1.2 |
| ahooks | >=3.6.2 |

## Usage

```bash
import { TableFormList } from '@infra/components'
```

## Contributing

You can contribute by following the steps:

1. Clone the [gitlab repo](https://git.garena.com/shopee/sz-devops/fe/kubernetes/components)
2. Checkout your dev branch

   ```bash
   git branch -b feature-xxx-xxx
   ```

3. Develop locally by run

   ```bash
   yarn dev
   ```

4. Write your **component** under the `src/components` folder, for example `TableFormList/index.tsx`
5. Write the **usage doc** in the `index.md` file under your component folder, for example `src/components/TableFormList`. By the way, recommend using `markdownlint` to format the docs. The docs are build by `dumi`, you can refer to [dumi demo](https://d.umijs.org/zh-CN/guide/basic#%E5%86%99%E7%BB%84%E4%BB%B6-demo) to write your docs
6. Write the **unit tests** in the `index.test.ts` file under your component folder, for example `src/components/TableFormList`. The unit test framework is [Jest](https://jestjs.io/), you can refer to [@testing-library/react](https://testing-library.com/docs/react-testing-library/example-intro) and [dom testing library](https://testing-library.com/docs/dom-testing-library/example-intro) to study how to write.
7. Push your branch and assign some approvers to review
