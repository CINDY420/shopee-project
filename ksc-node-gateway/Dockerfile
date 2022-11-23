FROM node:14 AS builder

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

COPY . .

RUN yarn build

RUN npm prune --production

FROM node:14-alpine

WORKDIR /usr/src/app
# copy from build image
COPY --from=builder /usr/src/app/configs ./configs
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
CMD node ./dist/main.js
