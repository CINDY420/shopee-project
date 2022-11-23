FROM node:14 AS builder
WORKDIR /usr/src/app
# install node modules
COPY package.json ./
COPY yarn.lock ./
RUN yarn --frozen-lockfile
# build
COPY tsconfig.build.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./
COPY src ./src
RUN yarn build

FROM node:14-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/tsconfig.build.json ./tsconfig.build.json
COPY --from=builder /usr/src/app/tsconfig.json ./tsconfig.json
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/src/configs/live.yaml /etc/env-config/live.yaml
COPY --from=builder /usr/src/app/src/configs/test.yaml /etc/env-config/test.yaml
COPY --from=builder /usr/src/app/src/configs/dev.yaml /etc/env-config/dev.yaml
COPY --from=builder /usr/src/app/src/configs/staging.yaml /etc/env-config/staging.yaml

CMD [ "node", "--trace-warnings", "dist/main" ]
