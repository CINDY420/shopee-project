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

FROM node:14
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/tsconfig.build.json ./tsconfig.build.json
COPY --from=builder /usr/src/app/tsconfig.json ./tsconfig.json
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/src/configs/config.live.ts /etc/env-config/live.ts
COPY --from=builder /usr/src/app/src/configs/config.test.ts /etc/env-config/test.ts
COPY --from=builder /usr/src/app/src/configs/config.default.ts /etc/env-config/default.ts

CMD [ "node", "--trace-warnings", "dist/main" ]
