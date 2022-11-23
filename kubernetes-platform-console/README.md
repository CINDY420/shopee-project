# kubernetes-platform-console

## Getting Started

### Install yarn
[Yarn Installation Guide](https://classic.yarnpkg.com/en/docs/install#mac-stable)

### Install dependency packages
```shell
cd kubernetes-platform-console
yarn install
```
### Scripts of this program
#### Run in development mode:
```shell
yarn dev
```
#### Build for different environments:
### (Notice: Please modify the version in package.json before deploying.)
```shell
yarn build:dev
yarn build:test
yarn build:staging
yarn build:live
```

#### Use storybook:
```shell
yarn storybook
yarn build-storybook
```
#### Enforce code style:
```shell
yarn lint-staged
yarn eslint
```
